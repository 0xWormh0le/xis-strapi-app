import { Flex } from '@chakra-ui/core'
import get from 'lodash/get'
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Container, Card, GqlStateHandler } from '../../components'
import { Text } from '../../components/Typography'
import { useGetMessageQuery, Message } from '../../generated/graphql'
import { PageWrap } from '../../layouts'
import moment from 'moment'
import { theme } from '../../theme/index'

type MatchParams = {
  idTicket: string
  idMessage: string
}

type MessageDetailProps = RouteComponentProps<MatchParams>

const MessageDetail: React.FC<MessageDetailProps> = ({ match: { params }, history }) => {
  const { idTicket, idMessage } = params
  const { data, loading, error } = useGetMessageQuery({
    variables: { ticketId: idTicket, messageId: idMessage }
  })
  const message = get(data, 'messages', [])
  const { colors } = theme

  return (
    <PageWrap>
      <Container fluid={true}>
        <GqlStateHandler loading={loading} error={error}>
          {message && (message as Message[]) && (
            <Card mr={5} pb={5} pl={10} height="100%">
              <Text pt={5} mb={5} fontWeight="bold">
                Message - {message[0]?.id}
              </Text>
              <Flex flexDirection="column" textAlign="left">
                <Text color={colors.solid.lightGray}>Title</Text>
                <Text>{message[0]?.title} </Text>
              </Flex>
              <Flex flexDirection="column" textAlign="left" mt={10}>
                <Text color={colors.solid.lightGray}>Description</Text>
                <Text>{message[0]?.description}</Text>
              </Flex>
              <Flex flexDirection="column" textAlign="left" mt={10}>
                <Text color={colors.solid.lightGray}>Date Created</Text>
                <Text>{moment(message[0]?.created_at).format('MMMM Do YYYY')}</Text>
              </Flex>
            </Card>
          )}
        </GqlStateHandler>
      </Container>
    </PageWrap>
  )
}

export default MessageDetail
