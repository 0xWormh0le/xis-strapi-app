import { Flex } from '@chakra-ui/core'
import * as React from 'react'
import { useMediaQuery } from 'react-responsive'
import { useSpring } from 'react-spring'
import { ColorProps } from 'styled-system'
import { AppContext } from '../../contexts/ApplicationProvider.context'
import { PageWrap } from '../../layouts'
import images from '../../theme/images'
import Header from '../Header'
import { Text } from '../Typography'
import HamburgerIcon from './icon'
import {
  Logo,
  LogoCont,
  NavItemWrapper,
  RenderWrapper,
  SideBarWrapper,
  StyledLink,
  Tooltip
} from './styles'

export type Mode = 'cover' | 'push'

type NavItems = {
  to: string
  title: string
  icon: React.ReactNode
  subMenu?: Array<{ to: string; title: string }>
}

type SideBarProps = ColorProps & {
  mode: Mode
  color: string
  hoverColor: string
  accentColor: string
  navItems: NavItems[]
}

type SideBarLinkProps = ColorProps & {
  to: string
  open: boolean
  title: string
  color?: string
  hoverColor: string
  accentColor: string
  icon: React.ReactNode
}

const SideBarLink: React.FC<SideBarLinkProps> = ({
  to,
  open,
  title,
  color,
  accentColor,
  icon,
  hoverColor
}) => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })
  return (
    <StyledLink
      px={4}
      to={to}
      color={color}
      aria-label={title}
      hoverColor={hoverColor}
      accentColor={accentColor}
      activeClassName="active-nav-link"
      className={`${open ? 'nav-link' : 'nav-link-text-hidden'}`}
    >
      <NavItemWrapper className="sidebar-nav-item-wrapper" open={open}>
        {icon}
        <Text pointer={true} ml={4}>
          {title}
        </Text>
        {!open && !isTabletOrMobile && (
          <Tooltip className="sidebar-tooltip">
            <Text color={color}>{title}</Text>
          </Tooltip>
        )}
      </NavItemWrapper>
    </StyledLink>
  )
}

const MemoSideBarLink = React.memo(SideBarLink)

const SideBar: React.FC<SideBarProps> = ({
  children,
  mode,
  navItems,
  color,
  bg,
  accentColor,
  hoverColor
}) => {
  const { drawerOpen, toggleDrawer } = React.useContext(AppContext)

  const imageStyle = useSpring({
    config: { duration: 150 },
    opacity: drawerOpen ? 1 : 0
  })

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })

  return (
    <PageWrap pt={0} pb={0}>
      <SideBarWrapper
        bg={bg}
        color={color}
        open={drawerOpen}
        mode={isTabletOrMobile ? 'cover' : mode}
      >
        <LogoCont borderBottomColor="gray.700" open={drawerOpen}>
          <HamburgerIcon open={drawerOpen} onClick={() => toggleDrawer()} />
          <Flex
            flex={1}
            height="100%"
            alignItems="center"
            pr={drawerOpen ? 4 : 0}
            justifyContent="flex-end"
          >
            <Logo width="50%" style={imageStyle} src={images.logoWhite} />
          </Flex>
        </LogoCont>
        {navItems.map((props) => (
          <MemoSideBarLink
            bg={bg}
            color={color}
            open={drawerOpen}
            key={props.title}
            hoverColor={hoverColor}
            accentColor={accentColor}
            {...props}
          />
        ))}
      </SideBarWrapper>
      <RenderWrapper
        pl={isTabletOrMobile ? 0 : mode === 'cover' ? '60px' : drawerOpen ? '250px' : '60px'}
        mode={mode}
      >
        <Header open={drawerOpen} />
        {children}
      </RenderWrapper>
    </PageWrap>
  )
}

export default SideBar

SideBar.defaultProps = {
  mode: 'push',
  navItems: []
}
