import { Flex, Button, Box, FormLabel, Switch } from '@chakra-ui/core'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps, useHistory } from 'react-router'
import { Container, Table, Card } from '../../components'
import { Text } from '../../components/Typography'
import { PageWrap } from '../../layouts'
import moment from 'moment'
import { Cell, Row } from 'react-table'
import {
  useUpdateNotificationMutation,
  GetNotificationsDocument,
  Notifications as NotificationsType
} from '../../generated/graphql'
import { useAuthentication } from '../../hooks'
import client from '../../apollo'
import { theme } from '../../theme/index'

const Notifications: React.FC<RouteComponentProps> = () => {
  const { colors } = theme
  const { getUser } = useAuthentication()
  const { user } = getUser()
  const [updateNotification] = useUpdateNotificationMutation()
  const history = useHistory()
  const [allNotifications, setAllNotificiations] = useState<NotificationsType[]>([])
  const [tableView, setTableView] = useState(false)

  useEffect(() => {
    const refreshNotifications = () => {
      client
        .query({
          query: GetNotificationsDocument,
          variables: { contractorId: user.id },
          fetchPolicy: 'network-only'
        })
        .then((res: any) => {
          setAllNotificiations(res.data.notifications)
        })
    }

    const localNotifications = sessionStorage.getItem('notifications')
    if (localNotifications) {
      setAllNotificiations(JSON.parse(localNotifications))
    } else {
      refreshNotifications()
    }
  }, [setAllNotificiations, user.id])

  const count: number = allNotifications.length

  const handleTableClick = async ({ original }: Row<NotificationsType>) => {
    await updateNotification({
      variables: {
        id: original.id,
        input: {
          read: true
        }
      }
    })

    history.push(`/tickets/${original?.ticket?.id}`)
  }

  const handleTileClick = async (notification: any) => {
    await updateNotification({
      variables: {
        id: notification,
        input: {
          read: true
        }
      }
    })

    history.push(`/tickets/${notification}`)
  }

  const handleReadAll = () => {
    if (allNotifications) {
      allNotifications.map(async (item: any) => {
        await updateNotification({
          variables: {
            id: item.id,
            input: {
              read: true
            }
          }
        })
      })
    }
  }

  const RenderId = ({ row: { original } }: Cell<NotificationsType>) => {
    return (
      <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
        <Text>{original?.id}</Text>
      </Flex>
    )
  }

  const RenderTitle = ({ row: { original } }: Cell<NotificationsType>) => {
    return (
      <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
        <Text>{original?.title}</Text>
      </Flex>
    )
  }

  const RenderDescription = ({ row: { original } }: Cell<NotificationsType>) => {
    return (
      <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
        <Text>{original?.description}</Text>
      </Flex>
    )
  }

  const RenderTicketId = ({ row: { original } }: Cell<NotificationsType>) => {
    return (
      <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
        <Text>{original?.ticket?.ticketNumber}</Text>
      </Flex>
    )
  }

  const RenderCreatedAt = ({ row: { original } }: Cell<NotificationsType>) => {
    return (
      <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
        <Text>{moment(original?.created_at).format('YYYY-MM-DD')}</Text>
      </Flex>
    )
  }

  const notificationsColumns = [
    {
      Header: 'ID',
      accessor: 'id',
      Cell: RenderId
    },
    {
      Header: 'Title',
      accessor: 'title',
      Cell: RenderTitle
    },
    {
      Header: 'Description',
      accessor: 'description',
      Cell: RenderDescription
    },
    {
      Header: 'Ticket',
      accessor: 'ticket',
      Cell: RenderTicketId
    },
    {
      Header: 'Date Added',
      accessor: 'createdAt',
      Cell: RenderCreatedAt
    }
  ]

  const renderTileView = (notification: any) => {
    return (
      <Box
        key={notification?.id}
        onClick={() => handleTileClick(notification?.ticket?.id)}
        m={1}
        width={['100%', '48%', '48%', '24%']}
      >
        <Card>
          <Flex flexDirection="row" justifyContent="space-between" m={2}>
            <Flex flexDirection="column">
              <Text color={colors.solid.lightGray}>ID</Text>
              <Text>{notification?.id}</Text>
            </Flex>
            <Flex flexDirection="column">
              <Text color={colors.solid.lightGray}>Ticket Number</Text>
              <Text>{notification?.ticket?.ticketNumber}</Text>
            </Flex>
          </Flex>
          <Flex flexDirection="column" m={2}>
            <Text color={colors.solid.lightGray}>Title</Text>
            <Text>{notification?.title ? notification?.title : 'No Title'}</Text>
          </Flex>
          <Flex flexDirection="column" m={2}>
            <Text color={colors.solid.lightGray}>Description</Text>
            <Text>{notification?.description ? notification?.description : 'No Description'}</Text>
          </Flex>
          <Flex flexDirection="column" m={2}>
            <Text color={colors.solid.lightGray}>Created At</Text>
            <Text>{moment(notification?.created_at).format('YYYY-MM-DD')}</Text>
          </Flex>
        </Card>
      </Box>
    )
  }

  return (
    <PageWrap>
      <Container fluid={true}>
        <Flex flexDirection={['column', 'row']}>
          <Flex flexDirection={['row', 'column']} width="100%" pl={2} mb={5}>
            <Box mr={[0, 2]} width={['100%', 'auto']}>
              {count === 1 ? <Text>{count} Notification</Text> : <Text>{count} Notifications</Text>}
            </Box>
            <Box mt={[2, 0]}>
              <Button title="Read All" onClick={() => handleReadAll()}>
                Read All
              </Button>
            </Box>
          </Flex>
          <Flex justify="center" align="center">
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
        </Flex>

        <Flex flexDirection="row" flexWrap="wrap" width="100%">
          {allNotifications.length > 0 ? (
            <>
              {tableView ? (
                <Table
                  columns={notificationsColumns}
                  onRowClick={handleTableClick}
                  data={allNotifications}
                />
              ) : (
                allNotifications.map((notification) => {
                  return renderTileView(notification)
                })
              )}
            </>
          ) : (
            <Flex justifyContent="center">
              <Text>There are no notifications</Text>
            </Flex>
          )}
        </Flex>
      </Container>
    </PageWrap>
  )
}

export default Notifications
