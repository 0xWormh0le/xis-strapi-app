import React, { useState } from 'react'
import { RouteComponentProps, useHistory } from 'react-router'
import {
  Container,
  Table,
  ModalWrap,
  ConnectedTextArea,
  ConnectedFormGroup,
  Card
} from '../../components'
import get from 'lodash/get'
import {
  useGetMessagesQuery,
  Message,
  useCreateMessageMutation,
  useGetTicketQuery,
  Ticket
} from '../../generated/graphql'
import { Flex, Text, Button, Input, FormLabel, Switch } from '@chakra-ui/core'
import { Cell, Row } from 'react-table'
import { PageWrap } from '../../layouts'
import moment from 'moment'
import { Field, Form, Formik, FormikProps } from 'formik'
import * as Yup from 'yup'
import { theme } from '../../theme/index'

type MatchParams = {
  idTicket: string
}

type MessagesProps = RouteComponentProps<MatchParams>

const Messages: React.FC<MessagesProps> = ({ match: { params } }) => {
  const { colors } = theme
  const history = useHistory()
  const { idTicket } = params
  const [createMessage] = useCreateMessageMutation()
  const { data, refetch } = useGetMessagesQuery({
    variables: { ticketId: idTicket }
  })
  const { data: ticketData } = useGetTicketQuery({
    variables: { ticketId: idTicket }
  })
  const ticket: Ticket | null | undefined = get(ticketData, 'ticket', undefined)
  const [showModal, setShowModal] = useState(false)
  const [tableView, setTableView] = useState(false)
  const INITIAL_VALUES = {
    title: '',
    description: ''
  }
  const LoginFormValidation = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required')
  })

  let count: any = 0
  if (data && data.messages) {
    data?.messages.map(() => {
      count++
    })
  }

  const RenderId = ({ row: { original } }: Cell<Message>) => {
    return (
      <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
        <Text>{original.id}</Text>
      </Flex>
    )
  }

  const RenderTitle = ({ row: { original } }: Cell<Message>) => {
    return (
      <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
        <Text>{original?.title}</Text>
      </Flex>
    )
  }

  const RenderDescription = ({ row: { original } }: Cell<Message>) => {
    return (
      <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
        <Text>{original.description}</Text>
      </Flex>
    )
  }

  const RenderTicketId = ({ row: { original } }: Cell<Message>) => {
    return (
      <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
        <Text>{original.ticket?.ticketNumber}</Text>
      </Flex>
    )
  }

  const RenderCreatedAt = ({ row: { original } }: Cell<Message>) => {
    return (
      <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
        <Text>{moment(original.created_at).format('MMMM Do YYYY')}</Text>
      </Flex>
    )
  }

  const columns = [
    {
      Header: 'ID',
      accessor: 'Id',
      Cell: RenderId
    },
    {
      Header: 'Title',
      accessor: 'Title',
      Cell: RenderTitle
    },
    {
      Header: 'Description',
      accessor: 'Description',
      Cell: RenderDescription
    },
    {
      Header: 'Ticket',
      accessor: 'Ticket',
      Cell: RenderTicketId
    },
    {
      Header: 'Created At',
      accessor: 'CreatedAt',
      Cell: RenderCreatedAt
    }
  ]

  const handleClick = ({ original: { id: idMessage } }: Row<Message>) => {
    history.push(`/tickets/${idTicket}/Messages/${idMessage}`)
  }

  const handleTileClick = (idTicket: string, idMessage: string) => {
    history.push(`/tickets/${idTicket}/Messages/${idMessage}`)
  }

  const renderTileView = (message: any) => {
    return (
      <Flex
        key={message?.id}
        onClick={() => handleTileClick(message?.ticket?.id, message?.id)}
        m={1}
        width={['100%', '48%', '48%', '24%']}
      >
        <Card width="100%">
          <Flex flexDirection="row" justifyContent="space-between" m={2}>
            <Flex flexDirection="column">
              <Text color={colors.solid.lightGray}>ID</Text>
              <Text>{message?.id}</Text>
            </Flex>
            <Flex flexDirection="column">
              <Text color={colors.solid.lightGray}>Ticket Number</Text>
              <Text>{message?.ticket?.ticketNumber}</Text>
            </Flex>
          </Flex>
          <Flex flexDirection="column" m={2}>
            <Text color={colors.solid.lightGray}>Title</Text>
            <Text>{message?.title ? message?.title : 'No Title'}</Text>
          </Flex>
          <Flex flexDirection="column" m={2}>
            <Text color={colors.solid.lightGray}>Description</Text>
            <Text>{message?.description ? message?.description : 'No Description'}</Text>
          </Flex>
          <Flex flexDirection="column" m={2}>
            <Text color={colors.solid.lightGray}>Created At</Text>
            <Text>{moment(message?.created_at).format('YYYY-MM-DD')}</Text>
          </Flex>
        </Card>
      </Flex>
    )
  }

  type MessageFormValues = typeof INITIAL_VALUES

  return (
    <PageWrap>
      <Container fluid={true}>
        <Flex flexDirection="row">
          <Flex justifyContent="space-between" flexDirection="row" width="100%" pl={2}>
            <Flex mr={2}>
              <Flex flexDirection="column">
                <Text pb={5}>{count > 1 ? `${count} messages` : `${count} message`}</Text>
              </Flex>
            </Flex>
            <Flex>
              <Button size="sm" title="View Messages" onClick={() => setShowModal(true)}>
                New Message
              </Button>
            </Flex>
          </Flex>
        </Flex>
        <Flex justify={['center', 'start']} align="center">
          <FormLabel width={100} htmlFor="table-view">
            Table View
          </FormLabel>
          <Switch
            id="table-view"
            size="md"
            children="children"
            onChange={() => setTableView(!tableView)}
            value={tableView}
          />
        </Flex>

        <Flex flexDirection="row" flexWrap="wrap" width="100%" mt={2}>
          {data && data.messages && data.messages.length > 0 ? (
            tableView ? (
              <Table columns={columns} onRowClick={handleClick} data={data?.messages || []} />
            ) : (
              data.messages.map((message) => {
                return renderTileView(message)
              })
            )
          ) : (
            <Flex justifyContent="center">
              <Text>There are currently no messages available</Text>
            </Flex>
          )}
        </Flex>
        <ModalWrap
          isCentered={true}
          onClose={() => setShowModal(false)}
          isOpen={showModal}
          title="New Message"
        >
          <Formik
            initialValues={INITIAL_VALUES}
            validationSchema={LoginFormValidation}
            onSubmit={async ({ title, description }, { setStatus, setSubmitting }) => {
              try {
                setSubmitting(true)
                await createMessage({
                  variables: {
                    input: {
                      title: title,
                      description: description,
                      ticket: idTicket
                    }
                  }
                })

                setShowModal(false)
                refetch()
                setSubmitting(false)
              } catch (err) {
                setStatus(err.message)
                setSubmitting(false)
              }
            }}
            render={({ handleSubmit, isSubmitting }: FormikProps<MessageFormValues>) => {
              return (
                <Form>
                  <Flex m={5} flexDirection="column">
                    <Text pb={5}>Ticket</Text>
                    <Input
                      title="Ticket"
                      value={
                        ticket && ticket.ticketNumber
                          ? ticket?.ticketNumber
                          : `No ticket number for Ticket ${idTicket}`
                      }
                      size="md"
                      isDisabled={true}
                    />
                    <Flex>
                      <Field mt={5} name="title" label="Title" component={ConnectedFormGroup} />
                    </Flex>
                    <Flex>
                      <Field
                        mt={5}
                        name="description"
                        label="Description"
                        component={ConnectedTextArea}
                      />
                    </Flex>
                    <Button
                      size="sm"
                      ml={2}
                      isFullWidth
                      variantColor="brand"
                      isLoading={isSubmitting}
                      type="submit"
                      onClick={() => handleSubmit()}
                    >
                      Done
                    </Button>
                  </Flex>
                </Form>
              )
            }}
          />
        </ModalWrap>
      </Container>
    </PageWrap>
  )
}

export default Messages
