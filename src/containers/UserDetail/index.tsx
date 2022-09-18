import { Box, Button, Flex } from '@chakra-ui/core'
import get from 'lodash/get'
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Container, FillLoader } from '../../components'
import { H4, Text } from '../../components/Typography'
import { useGetUserQuery, UsersPermissionsUser } from '../../generated/graphql'
import { PageWrap } from '../../layouts'

type MatchParams = {
  id: string
}

type UserDetailProps = RouteComponentProps<MatchParams>

const UserDetail: React.FC<UserDetailProps> = ({ match: { params }, history }) => {
  const { id } = params
  const { data, loading } = useGetUserQuery({ variables: { id } })

  const user: UsersPermissionsUser | null | undefined = get(data, 'getUser', undefined)

  if (loading) {
    return <FillLoader />
  }

  return (
    <PageWrap>
      <Container fluid={true}>
        {user && (
          <Flex mb={4} flexDirection="row" justifyContent="space-between" alignItems="center">
            <Box flexDirection="column" justifyContent="center">
              <H4 mb={0}>{user.username}</H4>
            </Box>
            <Box>
              <Button onClick={() => null} variantColor="error" variant="solid">
                <Text pointer>Archive {user.username}</Text>
              </Button>
            </Box>
          </Flex>
        )}
      </Container>
    </PageWrap>
  )
}

export default UserDetail
