import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
import { Container, SearchBar, Table } from 'components'
import { useGetUserQuery, useGetTicketsQuery, Ticket } from 'generated/graphql'
import { useAuthentication } from 'hooks'
import { Flex, Text, Box, Badge, FormLabel, Switch, useToast } from '@chakra-ui/core'
import { Cell, Row } from 'react-table'
import { PageWrap } from 'layouts'
import moment from 'moment'
import { theme } from 'theme/index'
import TicketTile from './TicketTile'
import { configStorage } from 'utils'

interface TicketProps extends RouteComponentProps {
  warrantyOnly: boolean
}

const RenderTicketId = ({ row: { original } }: Cell<Ticket>) => {
  return (
    <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
      <Text>{original.ticketNumber}</Text>
    </Flex>
  )
}

const RenderDateRaised = ({ row: { original } }: Cell<Ticket>) => {
  return (
    <Flex justifyContent="center" flexDirection="column" alignItems="flex-start" width={100}>
      <Text>{moment(original.created_at).format('MMMM Do YYYY')}</Text>
    </Flex>
  )
}

const RenderLocation = ({ row: { original } }: Cell<Ticket>) => {
  return (
    <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
      <Text>{original.location?.address}</Text>
    </Flex>
  )
}

const RenderSummary = ({ row: { original } }: Cell<Ticket>) => {
  return (
    <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
      <Text>{original.summary}</Text>
    </Flex>
  )
}

const RenderStatus = ({ row: { original } }: Cell<Ticket>) => {
  return (
    <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
      <Text>{original.status?.name}</Text>
    </Flex>
  )
}

const RenderWarranty = ({ row: { original } }: Cell<Ticket>) => (
  <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
    {original.warranty ? (
      <Badge variantColor="green">On Warranty</Badge>
    ) : (
      <Badge>No Warranty</Badge>
    )}
  </Flex>
)

const columns = [
  {
    Header: 'Ticket',
    accessor: 'Id',
    Cell: RenderTicketId
  },
  {
    Header: 'Date Raised',
    accessor: 'DateRaised',
    Cell: RenderDateRaised
  },
  {
    Header: 'Location',
    accessor: 'location',
    Cell: RenderLocation
  },
  {
    Header: 'Summary',
    accessor: 'Summary',
    Cell: RenderSummary
  },
  {
    Header: 'Status',
    accessor: 'status',
    Cell: RenderStatus
  },
  {
    Header: 'Warranty',
    accessor: 'Warranty',
    Cell: RenderWarranty
  }
]

const Tickets: React.FC<TicketProps> = ({ history, warrantyOnly }) => {
  const { colors } = theme
  const toast = useToast()
  const [searchId, setSearchId] = useState('')
  const [searchSummary, setSearchSummary] = useState('')
  const [tableView, setTableView] = useState(!!configStorage.get('ticketView'))
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
  const { data, refetch } = useGetTicketsQuery({
    variables: {
      filter: {
        client: { id: userData?.user?.client?.id || '' },
        warranty: warrantyOnly
      }
    }
  })

  const handleIdSearch = (id: string) => {
    setSearchId(id)
    refetch({ filter: { contractor: { id: user.id }, ticketNumber_contains: id } })
  }

  const handleSummarySearch = (summary: string) => {
    setSearchSummary(summary)
    refetch({ filter: { contractor: { id: user.id }, summary_contains: summary } })
  }

  const handleTableClick = ({ original: { id: idTicket } }: Row<Ticket>) => {
    history.push(`/tickets/${idTicket}`)
  }

  const handleTableViewClick = () => {
    configStorage.set('ticketView', !tableView)
    setTableView(!tableView)
  }

  return (
    <PageWrap>
      <Container fluid={true}>
        <Flex flexDirection={['column', 'row']}>
          <Flex flexDirection={['column', 'row']} width="100%" pl={2} mb={5}>
            <Box mr={[0, 2]} width={['100%', 'auto']}>
              <SearchBar
                placeholder="ID Search"
                value={searchId}
                onChange={(e: any) => handleIdSearch(e.target.value)}
                width="100%"
              />
            </Box>
            <Box mt={[2, 0]} width={['100%', 'auto']}>
              <SearchBar
                placeholder="Summary Search"
                value={searchSummary}
                onChange={(e: any) => handleSummarySearch(e.target.value)}
                width="100%"
              />
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
              onChange={handleTableViewClick}
              isChecked={tableView}
            />
          </Flex>
        </Flex>

        <Flex flexDirection="row" flexWrap="wrap" width="100%" mt={2}>
          {tableView ? (
            <Table columns={columns} onRowClick={handleTableClick} data={data?.tickets || []} />
          ) : (
            data &&
            data.tickets &&
            data.tickets.map((ticket) => (
              <Box key={ticket?.id} m={1} width={['100%', '48%', '48%', '24%']}>
                <Link to={warrantyOnly ? `/warranties/${ticket?.id}` : `/tickets/${ticket?.id}`}>
                  <TicketTile ticket={ticket} color={colors.solid.lightGray} />
                </Link>
              </Box>
            ))
          )}
        </Flex>
      </Container>
    </PageWrap>
  )
}

export default Tickets
