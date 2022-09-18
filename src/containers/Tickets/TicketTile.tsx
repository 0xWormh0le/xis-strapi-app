import React from 'react'
import { Flex, Text, Badge } from '@chakra-ui/core'
import { Card } from 'components'
import moment from 'moment'

interface TicketTileProps {
  ticket: any
  color: string
}

const TicketTile: React.FC<TicketTileProps> = ({ ticket, color }) => (
  <Card>
    <Flex flexDirection="row" justifyContent="space-between" m={2}>
      <Flex flexDirection="column">
        <Text color={color}>Ticket</Text>
        <Text>{ticket?.ticketNumber}</Text>
      </Flex>
      <Flex flexDirection="column">
        <Text color={color}>Date Raised</Text>
        <Text>{moment(ticket?.created_at).format('MMMM Do YYYY')}</Text>
      </Flex>
    </Flex>

    <Flex flexDirection="row" justifyContent="space-between" m={2}>
      <Flex flexDirection="column">
        <Text color={color}>Status</Text>
        <Text>{ticket?.status?.name}</Text>
      </Flex>
      <Flex flexDirection="column">
        <Text color={color} mb={1}>
          Warranty
        </Text>
        {ticket?.warranty ? (
          <Badge variantColor="green">On Warranty</Badge>
        ) : (
          <Badge>No Warranty</Badge>
        )}
      </Flex>
    </Flex>

    <Flex flexDirection="column" m={2}>
      <Text color={color}>Summary</Text>
      <Text>{ticket?.summary ? ticket?.summary : 'No Summary'}</Text>
    </Flex>
  </Card>
)

export default TicketTile
