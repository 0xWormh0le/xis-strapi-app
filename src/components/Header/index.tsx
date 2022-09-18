import { Avatar, Flex, Button, Badge, useToast } from '@chakra-ui/core'
import styled from '@emotion/styled'
import * as React from 'react'
import { useMediaQuery } from 'react-responsive'
import { RouteComponentProps, withRouter, useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { color, ColorProps, space, SpaceProps } from 'styled-system'
import { useAppContext } from '../../contexts/ApplicationProvider.context'
import Breadcrumbs from '../Breadcrumbs'
import HamburgerIcon from '../SideBar/icon'
import { H5, Text } from '../Typography'
import { Bell } from 'react-feather'
import { useGetUserQuery, useGetNotificationsQuery } from '../../generated/graphql'
import { useAuthentication } from '../../hooks'

type HeaderProps = RouteComponentProps &
  ColorProps & {
    color?: string
    size?: number
    id?: string
    open?: boolean
    getLoggedInUser?: () => { name?: string; id: string }
  }

type HeaderContProps = SpaceProps &
  ColorProps & {
    color?: string
    open?: boolean
  }

const HeaderCont = styled.div<HeaderContProps>`
  ${space};
  ${color};
  top: 0;
  right: 0;
  height: 60px;
  z-index: 1300;
  display: flex;
  position: fixed;
  align-items: center;
  flex-direction: row;
  box-sizing: border-box;
  border-bottom-width: 1px;
  justify-content: space-between;
  left: ${(props) => (props.open ? '250px' : '60px')};
  @media screen and (max-width: 40em) {
    left: 0;
  }
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
`

const BreadCrumbCont = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  @media screen and (max-width: 40em) {
    display: none;
  }
`

const Header: React.FC<HeaderProps> = ({ ...rest }) => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })

  const { drawerOpen, toggleDrawer, profileImage } = useAppContext()

  const history = useHistory()
  const toast = useToast()

  const handleClick = () => {
    return history.push(`/notifications`)
  }

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

  const { data } = useGetNotificationsQuery({
    variables: { clientId: userData?.user?.client?.id || '' },
    fetchPolicy: 'network-only'
  })

  const username = userData?.user?.client?.name || ''

  if (data && data.notifications) {
    sessionStorage.setItem('notificationsCount', data.notifications.length.toString())
    sessionStorage.setItem('notifications', JSON.stringify(data.notifications))
  }

  return (
    <HeaderCont px={4} {...rest}>
      <BreadCrumbCont>
        <Breadcrumbs />
      </BreadCrumbCont>
      {isTabletOrMobile && (
        <HamburgerIcon
          ml={0}
          open={false}
          onClick={toggleDrawer}
          bg={drawerOpen ? 'gray.100' : 'gray.800'}
        />
      )}
      <Flex flexDirection="row">
        <Flex flexDirection="row" justifyContent="center" alignItems="center">
          <H5 mb={0} mr={4} fontWeight={300}>
            {username}
          </H5>
          <Button mr={5} bg="transparent" title="Notifications" onClick={() => handleClick()}>
            <Text pr={5}>
              {`${parseInt(
                sessionStorage.getItem('notificationsCount') || '0'
              )} Unread Notifications`}
            </Text>
            <Bell size={25} color="black" />
            {sessionStorage.getItem('notificationsCount') !== '0' ? (
              <Badge
                variant="solid"
                variantColor="red"
                borderRadius={50}
                position="absolute"
                top={25}
                right={15}
                height={2}
                width={2}
              />
            ) : null}
          </Button>
          <Link to="/profile">
            {/* 
            // @ts-ignore */}
            <Avatar bg="brand.500" size="sm" name={username} src={profileImage} />
          </Link>
        </Flex>
      </Flex>
    </HeaderCont>
  )
}

export default withRouter(Header)

Header.defaultProps = {
  bg: 'white'
}
