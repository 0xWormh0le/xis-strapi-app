import { Badge, Button, Flex, useDisclosure, Checkbox } from '@chakra-ui/core'
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Cell, Row } from 'react-table'
import {
  Container,
  EmptyListHandler,
  FallbackErrorMessage,
  FillLoader,
  ModalWrap,
  Table
} from '../../components'
import { H4, Text } from '../../components/Typography'
import { UsersPermissionsUser, useListUsersQuery } from '../../generated/graphql'
import { PageWrap } from '../../layouts'
import CreateUserForm from './CreateUserForm'

const InstitutionManagement: React.FC<RouteComponentProps> = ({ history }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const RenderProvider = ({ row: { original } }: Cell<UsersPermissionsUser>) => (
    <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
      <Badge variantColor="primary">{original.provider}</Badge>
    </Flex>
  )

  const RenderRole = ({ row: { original } }: Cell<UsersPermissionsUser>) => (
    <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
      <Badge variantColor="primary">{original.role?.name}</Badge>
    </Flex>
  )

  const RenderConfirmed = ({ row: { original } }: Cell<UsersPermissionsUser>) => (
    <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
      <Checkbox isDisabled defaultIsChecked={original.confirmed || false}>
        Confirmed
      </Checkbox>
    </Flex>
  )

  const RenderBlocked = ({ row: { original } }: Cell<UsersPermissionsUser>) => (
    <Flex justifyContent="center" flexDirection="column" alignItems="flex-start">
      <Checkbox isDisabled defaultIsChecked={original.blocked || false}>
        Blocked
      </Checkbox>
    </Flex>
  )

  const { data, loading, error, refetch } = useListUsersQuery()

  const users = data?.users || []

  const columns = [
    {
      Header: 'ID',
      accessor: 'id'
    },
    {
      Header: 'Username',
      accessor: 'username'
    },
    {
      Header: 'Email',
      accessor: 'email'
    },
    {
      Header: 'Role',
      accessor: 'role',
      Cell: RenderRole
    },
    {
      Header: 'Confirmed',
      accessor: 'confirmed',
      Cell: RenderConfirmed
    },
    {
      Header: 'Blocked',
      accessor: 'blocked',
      Cell: RenderBlocked
    },
    {
      Header: 'Provider',
      accessor: 'provider',
      Cell: RenderProvider
    }
  ]

  const handleClick = ({ original: { id } }: Row<UsersPermissionsUser>) => {
    history.push(`/users/${id}`)
  }

  if (loading) {
    return <FillLoader />
  }

  return (
    <PageWrap>
      <Container fluid={true}>
        <Flex mb={4} flexDirection="row" justifyContent="space-between" alignItems="center">
          <H4 mb={0}>Salons / Spas</H4>
          <Button onClick={onOpen} leftIcon="plus-square" variantColor="primary" variant="solid">
            <Text pointer>Create New</Text>
          </Button>
        </Flex>
        {users && users.length > 0 ? (
          <Table<UsersPermissionsUser>
            columns={columns}
            onRowClick={handleClick}
            data={users || []}
          />
        ) : (
          <EmptyListHandler message="No Salons / Spas to display." />
        )}
        {error && <FallbackErrorMessage message={error.message} />}
      </Container>
      <ModalWrap title="Create New Institution" onClose={onClose} isOpen={isOpen}>
        <CreateUserForm refetch={refetch} onClose={onClose} />
      </ModalWrap>
    </PageWrap>
  )
}

export default InstitutionManagement
