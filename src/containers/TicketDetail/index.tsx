import React, { useState, useEffect, ChangeEvent } from 'react'
import { Flex, Button, Input, Box, Link, useToast, Image, FormLabel, Switch } from '@chakra-ui/core'
import get from 'lodash/get'
import { RouteComponentProps } from 'react-router'
import { Container, FillLoader, Card, Table, ModalWrap, ConnectedAsyncSelect } from 'components'
import { H5, Text } from 'components/Typography'
import {
  useGetTicketQuery,
  Ticket,
  useGetQuotesQuery,
  Quote,
  useGetMessagesQuery,
  useUpdateTicketMutation,
  useCreateDocumentMutation,
  useDeleteDocumentMutation,
  useCreateQuoteMutation,
  Enum_Quote_Status,
  Document,
  GetStatusesDocument,
  useCreateNotificationMutation,
  useCreateSignalRegistryMutation,
  useGetConfigurationQuery,
  useGetUserQuery,
  useCreateVendorInformationMutation,
  useUpdateVendorInformationMutation,
  useCreateCiInformationMutation,
  useUpdateCiInformationMutation,
  Maybe,
  VendorInformation,
  CiInformation,
  useGetActualFaultsQuery,
  useGetResolutionCodesQuery,
  useGetSubFaultsQuery,
  ActualFault,
  ResolutionCode,
  SubFault
} from 'generated/graphql'
import { PageWrap } from 'layouts'
import moment from 'moment'
import { theme } from 'theme/index'
import { Cell, Row } from 'react-table'
import Uppy from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'
import { Dashboard } from '@uppy/react'
import { tokenStorage, configStorage } from 'utils'
import { Trash2 } from 'react-feather'
import { useAuthentication } from 'hooks'
import '@uppy/core/dist/style.css'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/status-bar/dist/style.css'
import { Field, Form, Formik, FormikProps } from 'formik'
import VendorInfo from './Vendor'
import CiInfo from './Ci'
import ClosingInfo, { ClosingType } from './Closing'
import * as Yup from 'yup'

type MatchParams = {
  idTicket: string
  idQuote: string
}

type TicketDetailProps = RouteComponentProps<MatchParams>

const TicketDetail: React.FC<TicketDetailProps> = ({ match: { params }, history }) => {
  const { idTicket } = params
  const [updateTicket] = useUpdateTicketMutation()
  const [createNotification] = useCreateNotificationMutation()
  const [createSignalRegistry] = useCreateSignalRegistryMutation()
  const [createQuote] = useCreateQuoteMutation()
  const [createDocument] = useCreateDocumentMutation()
  const [deleteDocument] = useDeleteDocumentMutation()
  const [createVendorInformation] = useCreateVendorInformationMutation()
  const [updateVendorInformation] = useUpdateVendorInformationMutation()
  const [createCiInformation] = useCreateCiInformationMutation()
  const [updateCiInformation] = useUpdateCiInformationMutation()
  const { data: actualFaults } = useGetActualFaultsQuery()
  const { data: resolutionCodes } = useGetResolutionCodesQuery()
  const { data: subFaults } = useGetSubFaultsQuery()
  const [showModal, setShowModal] = useState(false)
  const [imageViewModal, setImageViewModal] = useState(false)
  const [tableView, setTableView] = useState(!!configStorage.get('ticketView'))
  const [imageUrl, setImageUrl] = useState()
  const [imageName, setImageName] = useState()
  const [imageId, setImageId] = useState()
  const { data, loading, refetch } = useGetTicketQuery({
    variables: { ticketId: idTicket },
    onCompleted: (data) => {
      const ticket = get(data, 'ticket') as Maybe<Ticket> | undefined
      setVendorInput(ticket?.vendor)
      setCiInput(ticket?.ci)
      setClosingInput({
        resolutionCode: ticket?.resolutionCode?.id,
        actualFault: ticket?.actualFault?.id,
        subFault: ticket?.subFault?.id
      })
      setQuoteAmount(ticket?.quoteAmount?.toString() || '')
    }
  })
  const { data: quoteData, refetch: quoteRefetch } = useGetQuotesQuery({
    variables: { ticketId: idTicket }
  })
  const { data: messageData } = useGetMessagesQuery({
    variables: { ticketId: idTicket }
  })
  const { data: configurationData } = useGetConfigurationQuery()

  const toast = useToast()
  const { getUser } = useAuthentication()
  const { user } = getUser()
  const { data: userData } = useGetUserQuery({
    variables: { id: user?.id },
    onError: ({ message }) => {
      toast({
        description: message
      })
    }
  })

  const { colors } = theme
  const ticket = get(data, 'ticket') as Maybe<Ticket> | undefined
  const [documentIds, setDocumentIds] = useState<string[]>([])
  const [quoteAmount, setQuoteAmount] = useState('')
  const [vendorInput, setVendorInput] = useState<Maybe<VendorInformation> | undefined>(undefined)
  const [ciInput, setCiInput] = useState<Maybe<CiInformation> | undefined>(undefined)
  const [closingInput, setClosingInput] = useState<Maybe<ClosingType> | undefined>(undefined)
  const currentDate = moment().format('YYYY-MM-DD')
  const expiryDate = moment(currentDate)
    .add(1, 'M')
    .format('YYYY-MM-DD')

  let count: any = 0
  if (messageData && messageData.messages) {
    messageData?.messages.map(() => {
      count++
    })
  }

  const showQuoteBuilder =
    configurationData &&
    configurationData.configurations &&
    configurationData?.configurations[0]?.showQuoteBuilder

  const showVendorInfo =
    configurationData &&
    configurationData.configurations &&
    configurationData?.configurations[0]?.showVendorInfo

  const showCiInfo =
    configurationData &&
    configurationData.configurations &&
    configurationData?.configurations[0]?.showCiInfo

  const showClosingInfo =
    configurationData &&
    configurationData.configurations &&
    configurationData?.configurations[0]?.showClosingInfo

  useEffect(() => {
    quoteRefetch()

    if (ticket && ticket.documents) {
      ticket.documents.map((doc) => {
        if (doc && doc.id) {
          if (!documentIds.includes(doc.id)) {
            documentIds.push(doc?.id)
            setDocumentIds(documentIds)
          }
        }

        return documentIds
      })
    }
  }, [quoteRefetch, documentIds, ticket])

  const handleAddQuotationClick = async () => {
    return await createQuote({
      variables: {
        input: {
          contractor: user.id,
          ticket: idTicket,
          status: Enum_Quote_Status.Pending,
          expiryDate: expiryDate
        }
      }
    }).then(async (res: any) => {
      if (res && res.data) {
        return history.push(`/tickets/${idTicket}/QuoteDetail/${res.data.createQuote.quote.id}`)
      }
    })
  }

  const handleDocumentClick = ({ original: { id, file, name } }: Row<Document>) => {
    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i

    if (id && file && file.url && name) {
      if (allowedExtensions.exec(file?.url)) {
        setImageId(id)
        setImageUrl(
          process.env.REACT_APP_API_HOST ? process.env.REACT_APP_API_HOST + file.url : file.url
        )
        setImageName(name)
        setImageViewModal(true)
      }
    }
  }

  const handleTileDocumentClick = (id: string, file: any, name: string) => {
    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i

    if (id && file && file.url && name) {
      if (allowedExtensions.exec(file?.url)) {
        setImageId(id)
        setImageUrl(
          process.env.REACT_APP_API_HOST ? process.env.REACT_APP_API_HOST + file.url : file.url
        )
        setImageName(name)
        setImageViewModal(true)
      }
    }
  }

  const handleQuoteClick = ({ original: { id: idQuote } }: Row<Quote>) => {
    history.push(`/tickets/${idTicket}/QuoteDetail/${idQuote}`)
  }

  const handleQuoteTileClick = (idQuote: string) => {
    history.push(`/tickets/${idTicket}/QuoteDetail/${idQuote}`)
  }

  const handleMessagesClick = () => {
    return history.push(`/tickets/${idTicket}/Messages`)
  }

  const handleCloseClick = () => {
    return history.push(`/tickets`)
  }

  const handleTableViewClick = () => {
    configStorage.set('ticketView', !tableView)
    setTableView(!tableView)
  }

  const handleQuoteAmountChange = (e: ChangeEvent<HTMLInputElement>) =>
    setQuoteAmount(e.target.value)

  if (loading) {
    return <FillLoader />
  }

  const RenderId = ({ row: { original } }: Cell<Quote>) => {
    return (
      <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
        <Text>{original.id}</Text>
      </Flex>
    )
  }

  const RenderStatus = ({ row: { original } }: Cell<Quote>) => {
    return (
      <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
        <Text>{original.status}</Text>
      </Flex>
    )
  }

  const RenderExpiryDate = ({ row: { original } }: Cell<Quote>) => {
    return (
      <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
        <Text>{original.expiryDate}</Text>
      </Flex>
    )
  }

  const uppy = Uppy({
    autoProceed: false,
    allowMultipleUploads: true,
    restrictions: {
      maxFileSize: null,
      maxNumberOfFiles: 100,
      allowedFileTypes: ['image/*', 'application/pdf', '.doc', '.docx', '.xls', '.xlsx']
    }
  })
    .use(XHRUpload, {
      endpoint: process.env.REACT_APP_API_HOST
        ? process.env.REACT_APP_API_HOST + '/upload'
        : '/upload',
      fieldName: 'files',
      headers: {
        Authorization: `Bearer ${tokenStorage.get()?.jwt}`
      }
    })
    .on('upload-success', async (file, response) => {
      try {
        await createDocument({
          variables: {
            input: {
              name: file.name,
              file: response.body[0].id,
              from: 'ticket'
            }
          }
        }).then(async (res: any) => {
          if (res && res.data) {
            const fileId = res.data.createDocument.document.id
            documentIds.push(fileId)
            setDocumentIds(documentIds)
            await updateTicket({
              variables: {
                id: idTicket,
                input: {
                  documents: documentIds
                }
              }
            })

            refetch()
          }
        })
      } catch (error) {
        toast({
          description: 'Something went wrong while uploading your document.'
        })
      }
    })

  const RenderName = ({ row: { original } }: Cell<Document>) => {
    return (
      <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
        <Text>{original.name}</Text>
      </Flex>
    )
  }

  const RenderCreatedAt = ({ row: { original } }: Cell<Document>) => {
    return (
      <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
        <Text>{moment(original.created_at).format('YYYY-MM-DD')}</Text>
      </Flex>
    )
  }

  const DeleteRow = async (fileId: any) => {
    await deleteDocument({
      variables: {
        id: fileId
      }
    })

    refetch()
    return toast({
      description: 'File deleted successfully.'
    })
  }

  const RenderDelete = ({ row: { original } }: Cell<Document>) => {
    return (
      <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
        <Button title="Delete" onClick={() => DeleteRow(original.id)}>
          <Trash2 size={20} color="black" />
        </Button>
      </Flex>
    )
  }

  const ticketColumns = [
    {
      Header: 'Name',
      accessor: 'name',
      Cell: RenderName
    },
    {
      Header: 'Date Added',
      accessor: 'createdAt',
      Cell: RenderCreatedAt
    },
    {
      Header: 'Delete',
      accessor: 'delete',
      Cell: RenderDelete
    }
  ]

  const quoteColumns = [
    {
      Header: 'Quote',
      accessor: 'Id',
      Cell: RenderId
    },
    {
      Header: 'Status',
      accessor: 'Status',
      Cell: RenderStatus
    },
    {
      Header: 'Expiry Date',
      accessor: 'ExpiryDate',
      Cell: RenderExpiryDate
    }
  ]

  const INITIAL_VALUES_STATUS = {
    status: {
      value: ticket?.status,
      label: ticket?.status?.name
    }
  }

  const StatusFormValidation = Yup.object().shape({
    status: Yup.string().required('Status is required')
  })

  const renderQuoteTileView = (quote: any) => {
    return (
      <Flex
        key={quote?.id}
        onClick={() => handleQuoteTileClick(quote.id)}
        m={1}
        width={['100%', '48%', '48%', '24%']}
      >
        <Card width="100%">
          <Flex flexDirection="row" justifyContent="space-between" m={2}>
            <Flex flexDirection="column">
              <Text color={colors.solid.lightGray}>ID</Text>
              <Text>{quote?.id}</Text>
            </Flex>
            <Flex flexDirection="column">
              <Text color={colors.solid.lightGray}>Status</Text>
              <Text>{quote?.status}</Text>
            </Flex>
          </Flex>
          <Flex flexDirection="column" m={2}>
            <Text color={colors.solid.lightGray}>Expiry Date</Text>
            <Text>{moment(quote?.expiryDate).format('YYYY-MM-DD')}</Text>
          </Flex>
        </Card>
      </Flex>
    )
  }

  const renderDocsTileView = (document: any) => {
    return (
      <Flex
        key={document?.id}
        onClick={() => handleTileDocumentClick(document?.id, document?.file, document?.name)}
        m={1}
        width={['100%', '48%', '48%', '24%']}
      >
        <Card width="100%">
          <Flex flexDirection="row" justifyContent="space-between" m={2}>
            <Flex flexDirection="column">
              <Text color={colors.solid.lightGray}>Name</Text>
              <Text>{document?.name}</Text>
            </Flex>
            <Button title="Delete" onClick={() => DeleteRow(document.id)}>
              <Trash2 size={20} color="black" />
            </Button>
          </Flex>
          <Flex flexDirection="column" m={2}>
            <Text color={colors.solid.lightGray}>Expiry Date</Text>
            <Text>{moment(document?.created_at).format('YYYY-MM-DD')}</Text>
          </Flex>
        </Card>
      </Flex>
    )
  }

  type StatusFormValues = typeof INITIAL_VALUES_STATUS

  return (
    <PageWrap>
      <Container fluid={true}>
        {ticket && (
          <>
            <Formik
              initialValues={INITIAL_VALUES_STATUS}
              validationSchema={StatusFormValidation}
              onSubmit={async ({ status }, { setStatus, setSubmitting }) => {
                try {
                  setSubmitting(true)
                  const qamount = quoteAmount === '' ? null : parseFloat(quoteAmount)

                  const vendorPromise = new Promise((resolve) => {
                    if (showVendorInfo) {
                      if (vendorInput) {
                        if (vendorInput.id === undefined) {
                          resolve(
                            createVendorInformation({
                              variables: {
                                input: vendorInput
                              }
                            })
                          )
                        } else {
                          updateVendorInformation({
                            variables: {
                              id: vendorInput.id,
                              input: {
                                vendorRef: vendorInput.vendorRef,
                                dispatchDate: vendorInput.dispatchDate,
                                expectedArrival: vendorInput.expectedArrival,
                                actualArrival: vendorInput.actualArrival
                              }
                            }
                          })
                          resolve(undefined)
                        }
                      } else {
                        resolve(null)
                      }
                    } else {
                      resolve(undefined)
                    }
                  }).then((data: any) => {
                    if (!data) {
                      return data
                    } else {
                      return data.data?.createVendorInformation?.vendorInformation?.id || undefined
                    }
                  })

                  const ciPromise = new Promise((resolve) => {
                    if (showCiInfo) {
                      if (ciInput) {
                        if (ciInput.id === undefined) {
                          resolve(
                            createCiInformation({
                              variables: {
                                input: ciInput
                              }
                            })
                          )
                        } else {
                          updateCiInformation({
                            variables: {
                              id: ciInput.id,
                              input: {
                                ciName: ciInput.ciName,
                                serialNum: ciInput.serialNum,
                                ciLocation: ciInput.ciLocation
                              }
                            }
                          })
                          resolve(undefined)
                        }
                      } else {
                        resolve(null)
                      }
                    } else {
                      resolve(undefined)
                    }
                  }).then((data: any) => {
                    if (!data) {
                      return data
                    } else {
                      return data.data?.createCiInformation?.ciInformation?.id || undefined
                    }
                  })

                  Promise.all([vendorPromise, ciPromise]).then(([vendor, ci]) =>
                    updateTicket({
                      variables: {
                        id: idTicket,
                        input: {
                          status: status?.value?.id,
                          quoteAmount: showQuoteBuilder
                            ? undefined
                            : qamount === null
                            ? null
                            : isNaN(qamount)
                            ? undefined
                            : qamount,
                          vendor,
                          ci,
                          resolutionCode: closingInput?.resolutionCode,
                          actualFault: closingInput?.actualFault,
                          subFault: closingInput?.subFault
                        }
                      }
                    })
                  )

                  if (status?.value?.id !== ticket?.status?.id) {
                    createSignalRegistry({
                      variables: {
                        input: {
                          action: 'TicketStatusUpdated',
                          entryId: parseInt(idTicket),
                          processedState: 0
                        }
                      }
                    })

                    createNotification({
                      variables: {
                        input: {
                          client: userData?.user?.client?.id || '',
                          ticket: idTicket,
                          title: 'Status updated',
                          description: `Status change on ${idTicket}`,
                          read: false
                        }
                      }
                    })
                  }

                  history.push(`/tickets`)
                  setSubmitting(false)
                } catch (err) {
                  setStatus(err.message)
                  setSubmitting(false)
                }
              }}
              render={({ handleSubmit, isSubmitting }: FormikProps<StatusFormValues>) => {
                return (
                  <Flex mb={5} justifyContent="space-between" flexDirection={['column', 'row']}>
                    <Box>
                      <H5>View Ticket - {ticket.ticketNumber}</H5>
                      <Form>
                        <Flex flexDirection="column">
                          <Field
                            name="status"
                            accessor="statuses"
                            queryDocument={GetStatusesDocument}
                            label="Select Status"
                            component={ConnectedAsyncSelect}
                            disabled={ticket.status?.complete}
                          />
                        </Flex>
                      </Form>
                    </Box>
                    <Box>
                      <Flex justifyContent={['center', 'start']}>
                        <Button
                          size="sm"
                          variant="outline"
                          title="Close"
                          onClick={handleCloseClick}
                        >
                          Close
                        </Button>
                        <Button
                          size="sm"
                          ml={2}
                          title="View Messages"
                          onClick={handleMessagesClick}
                        >
                          {count > 1 ? `(${count}) View Messages` : `(${count}) View Message`}
                        </Button>
                        <Button
                          size="sm"
                          ml={2}
                          variantColor="brand"
                          isLoading={isSubmitting}
                          type="submit"
                          onClick={handleSubmit}
                        >
                          Save
                        </Button>
                      </Flex>
                      <Flex justify="center" align="center" mt={5}>
                        <FormLabel width={100} htmlFor="table-view">
                          Table View
                        </FormLabel>
                        <Switch
                          id="table-view"
                          size="md"
                          children="children"
                          onChange={handleTableViewClick}
                          isChecked={tableView}
                        />
                      </Flex>
                    </Box>
                  </Flex>
                )
              }}
            />

            <Flex flexDirection={['column', 'row']} width="100%">
              <Box flex={2} height="100%">
                <Card p={3} mr={[0, 5]}>
                  <Text pt={5} mb={5} fontWeight="bold">
                    Ticket Information
                  </Text>
                  <Flex flexDirection={['column', 'row']} justifyContent="flex-start">
                    <Flex flexDirection="column" textAlign="left" width="35%">
                      <Text color={colors.solid.lightGray}>Vendor</Text>
                      <Text>{ticket.client?.name}</Text>
                    </Flex>
                    <Flex flexDirection="column" textAlign="left" width="35%" mt={[2, 0]}>
                      <Text color={colors.solid.lightGray}>Requested By</Text>
                      <Text>{ticket?.requestedBy}</Text>
                    </Flex>
                    <Flex flexDirection="column" textAlign="left" width="35%" mt={[2, 0]}>
                      <Text color={colors.solid.lightGray}>Date</Text>
                      <Text>{moment(ticket.created_at).format('MMMM Do YYYY')}</Text>
                    </Flex>
                  </Flex>
                  <Box mt={5}>
                    <Text color={colors.solid.lightGray}>Location</Text>
                    <Box
                      mt={2}
                      flexDirection={['column', 'column', 'column', 'row']}
                      display="flex"
                    >
                      <Input
                        width={250}
                        value={`${
                          ticket.location?.address ? ticket.location?.address : 'No Location'
                        }`}
                        isDisabled={true}
                      />
                      <Link
                        disabled={ticket.location?.address ? false : true}
                        href={`${ticket?.location?.googleMaps}`}
                        isExternal
                      >
                        <Button
                          size="sm"
                          mt={[2, 2, 2, 0]}
                          ml={[0, 0, 0, 2]}
                          bg="#717273"
                          color={colors.solid.white}
                          width={['100%', 'auto']}
                          title="Open Maps"
                          isDisabled={ticket.location?.address ? false : true}
                        >
                          Open Maps
                        </Button>
                      </Link>
                    </Box>
                    <Box mt={10} display="flex" flexDirection={['column', 'row']} flexWrap="wrap">
                      <Box mr={[0, 10]}>
                        <Text color={colors.solid.lightGray}>Ticket Number</Text>
                        <Input
                          width={250}
                          value={`${
                            ticket.ticketNumber ? ticket.ticketNumber : 'No Ticket Number'
                          }`}
                          isDisabled={true}
                        />
                      </Box>
                      {!showQuoteBuilder && (
                        <Box mr={[0, 10]} mt={[10, 0]}>
                          <Text color={colors.solid.lightGray}>Quote Amount</Text>
                          <Input
                            type="number"
                            width={250}
                            value={quoteAmount}
                            onChange={handleQuoteAmountChange}
                          />
                        </Box>
                      )}
                      <Box mt={[10, 0]}>
                        <Text color={colors.solid.lightGray}>Ticket SLA / Priority</Text>
                        <Input
                          width={250}
                          value={`${
                            ticket.ticketSlaPriority
                              ? ticket.ticketSlaPriority
                              : 'No Ticket SLA / Priority'
                          }`}
                          isDisabled={true}
                        />
                      </Box>
                    </Box>
                  </Box>
                  <Flex flexDirection="column" textAlign="left" mt={10}>
                    <Text color={colors.solid.lightGray}>Summary </Text>
                    <Text>{ticket.summary}</Text>
                  </Flex>
                  <Flex flexDirection="column" textAlign="left" mt={10} mb={10}>
                    <Text color={colors.solid.lightGray}>Description </Text>
                    <Text>{ticket.ticketSummary}</Text>
                  </Flex>
                </Card>
              </Box>
              {configurationData &&
              configurationData.configurations &&
              configurationData?.configurations[0]?.showWarranty ? (
                <Box flex={1} mt={[5, 0]}>
                  <Card p={5} height="100%">
                    <Text pt={5} mb={5} fontWeight="bold">
                      Warranty
                    </Text>
                    <Flex flexDirection="column" textAlign="left">
                      <Text color={colors.solid.lightGray}>Vendor</Text>
                      <Text>{ticket.client?.name} </Text>
                    </Flex>
                    <Flex flexDirection="column" textAlign="left" mt={10}>
                      <Text color={colors.solid.lightGray}>Category</Text>
                      <Text>N/A</Text>
                    </Flex>
                    <Flex flexDirection={['column', 'column', 'column', 'row']} mt={10}>
                      <Flex flexDirection="column" textAlign="left">
                        <Text color={colors.solid.lightGray}>Creation Date</Text>
                        <Text>{ticket.warrantyStartDate} </Text>
                      </Flex>
                      <Flex
                        flexDirection="column"
                        textAlign="left"
                        mt={[10, 10, 10, 0]}
                        ml={[0, 0, 0, 10]}
                      >
                        <Text color={colors.solid.lightGray}>Expiry Date</Text>
                        <Text>{ticket.warrantyEndDate} </Text>
                      </Flex>
                    </Flex>
                  </Card>
                </Box>
              ) : null}
            </Flex>

            {showVendorInfo && (
              <VendorInfo
                colors={colors}
                vendorInput={vendorInput}
                vendor={ticket.vendor}
                changeVendorInput={setVendorInput}
              />
            )}

            {showCiInfo && (
              <CiInfo colors={colors} ciInput={ciInput} ci={ticket.ci} changeCiInput={setCiInput} />
            )}

            {showClosingInfo && actualFaults && resolutionCodes && subFaults && (
              <ClosingInfo
                colors={colors}
                actualFaults={actualFaults.actualFaults as ActualFault[]}
                resolutionCodes={resolutionCodes.resolutionCodes as ResolutionCode[]}
                subFaults={subFaults.subFaults as SubFault[]}
                closingInput={closingInput}
                changeClosingInput={setClosingInput}
              />
            )}

            {showQuoteBuilder ? (
              <Flex>
                <Box width="100%">
                  <Card mt={5}>
                    <Text pl={5} pt={5} mb={5} fontWeight="bold">
                      Build Quote Builder
                    </Text>
                    <Flex pl={[2, 5]} pr={[2, 5]} flexDirection="row" flexWrap="wrap">
                      {quoteData && quoteData.quotes && quoteData.quotes.length > 0 ? (
                        tableView ? (
                          <Table
                            columns={quoteColumns}
                            onRowClick={handleQuoteClick}
                            data={quoteData?.quotes || []}
                          />
                        ) : (
                          quoteData.quotes.map((quote) => {
                            return renderQuoteTileView(quote)
                          })
                        )
                      ) : (
                        <Flex justifyContent="center">
                          <Text>Add a quote off the material you will require</Text>
                        </Flex>
                      )}
                    </Flex>
                    <Box justifyContent="right" mr={[3, 0]} ml={[3, 0]}>
                      <Button
                        size="sm"
                        width={['100%', 150]}
                        mr={4}
                        mt={10}
                        mb={5}
                        bg="#717273"
                        float={['unset', 'right']}
                        color={colors.solid.white}
                        title="Add Quotation"
                        onClick={handleAddQuotationClick}
                      >
                        Add Quotation
                      </Button>
                    </Box>
                  </Card>
                </Box>
              </Flex>
            ) : null}

            {configurationData &&
            configurationData.configurations &&
            configurationData?.configurations[0]?.showDocuments ? (
              <Flex>
                <Box width="100%">
                  <Card mt={5}>
                    <Text pl={5} pt={5} mb={5} fontWeight="bold">
                      Ticket Uploads
                    </Text>
                    <Flex pl={[2, 5]} pr={[2, 5]} flexDirection="row" flexWrap="wrap">
                      {ticket && ticket.documents && ticket.documents.length > 0 ? (
                        tableView ? (
                          <Table
                            columns={ticketColumns}
                            onRowClick={handleDocumentClick}
                            data={ticket.documents || []}
                          />
                        ) : (
                          ticket.documents.map((document) => {
                            return renderDocsTileView(document)
                          })
                        )
                      ) : (
                        <Flex justifyContent="center">
                          <Text>Upload all necessary documents here</Text>
                        </Flex>
                      )}
                    </Flex>
                    <Box justifyContent="right" mr={[3, 0]} ml={[3, 0]}>
                      <Button
                        size="sm"
                        width={['100%', 150]}
                        mr={4}
                        mt={10}
                        mb={5}
                        bg="#717273"
                        float={['unset', 'right']}
                        color={colors.solid.white}
                        title="Upload Files"
                        onClick={() => setShowModal(true)}
                      >
                        Upload Files
                      </Button>
                    </Box>
                  </Card>
                </Box>
              </Flex>
            ) : null}

            <ModalWrap
              isCentered={true}
              onClose={() => setShowModal(false)}
              isOpen={showModal}
              title="Upload Files"
            >
              <Dashboard uppy={uppy} />
            </ModalWrap>
            <ModalWrap
              isCentered={true}
              onClose={() => setImageViewModal(false)}
              isOpen={imageViewModal}
              title={`${imageId} - ${imageName}`}
            >
              <Image size="35em" objectFit="cover" src={imageUrl} alt={imageName} />
            </ModalWrap>
          </>
        )}
      </Container>
    </PageWrap>
  )
}

export default TicketDetail
