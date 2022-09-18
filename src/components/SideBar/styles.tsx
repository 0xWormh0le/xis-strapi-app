import { Flex } from '@chakra-ui/core'
import { FlexProps } from '@chakra-ui/core/dist/Flex'
import css from '@emotion/css'
import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'
import { NavLink, NavLinkProps } from 'react-router-dom'
import { animated } from 'react-spring'
import { color, ColorProps, space, SpaceProps } from 'styled-system'
import { theme } from '../../theme'
import { Mode } from '../SideBar'

export const RenderWrapper = styled.div<{ mode: Mode } & SpaceProps>`
  ${space};
  width: 100%;
  display: flex;
  max-width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  box-sizing: border-box;
  flex-direction: column;
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
`

type SideBarWrapperProps = ColorProps &
  SpaceProps & {
    open: boolean
    color?: string
    mode: Mode
  }

export const SideBarWrapper = styled.div<SideBarWrapperProps>`
  ${({ mode, open }: SideBarWrapperProps) => {
    if (mode === 'cover') {
      return css`
        top: 0;
        left: 0;
        bottom: 0;
        @media screen and (max-width: 40em) {
          left: ${open ? 0 : '-60px'};
        }
      `
    }
    return null
  }}
  top: 0;
  left: 0;
  ${color};
  ${space};
  bottom: 0;
  display: flex;
  z-index: 1700;
  position: fixed;
  max-width: 100%;
  min-height: 100vh;
  flex-direction: column;
  box-sizing: border-box;
  align-items: flex-start;
  justify-content: flex-start;
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  width: ${(props: SideBarWrapperProps) => (props.open ? '250px' : '60px')};
  & .sidebar-menu-icon {
    font-size: 21px;
    margin-left: 20px;
    transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  & .nav-link-text-hidden > div > span {
    opacity: 0;
    visibility: hidden;
    width: 0;
    transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
`

type LogoContProps = FlexProps & {
  open: boolean
}

export const LogoCont = styled(Flex)<LogoContProps>`
  height: 60px;
  position: fixed;
  overflow: hidden;
  position: relative;
  align-items: center;
  box-sizing: border-box;
  border-bottom-width: 1px;
  transition-property: width;
  justify-content: space-between;
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  width: ${(props: LogoContProps) => (props.open ? '250px' : '60px')};
  & img {
    transition-property: visibility, opacity;
    opacity: ${(props: LogoContProps) => (props.open ? 1 : 0)};
    transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    visibility: ${(props: LogoContProps) => (props.open ? 'visible' : 'hidden')};
  }
`

export const Logo = styled(animated.img)`
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
`

export const Tooltip = styled.div`
  opacity: 0;
  left: 70px;
  display: flex;
  font-size: 13px;
  border-radius: 5px;
  visibility: hidden;
  position: absolute;
  align-items: center;
  justify-content: center;
  transform: translateX(10px);
  flex-direction: column;
  background-color: rgba(40, 42, 47, 1);
  & p {
    margin: 0 !important;
    color: white;
    text-transform: uppercase;
  }
  &:after {
    top: 50%;
    width: 0;
    margin: 0;
    height: 0;
    left: -5px;
    content: '';
    line-height: 0;
    position: absolute;
    transform: translateY(-50%);
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-right: 5px solid ${theme.colors.neutral.dark};
  }
`

export const NavItemWrapper = styled.div<any>`
  flex: 1;
  height: 50px;
  display: flex;
  position: relative;
  align-self: stretch;
  align-items: center;
  white-space: nowrap;
  background: transparent;
  justify-content: flex-start;
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  &:hover .sidebar-tooltip {
    opacity: 1;
    width: auto;
    padding: 5px 10px;
    visibility: visible;
    transform: translateX(0);
    transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
`

type StyledLinkProps = NavLinkProps &
  ColorProps &
  SpaceProps & {
    accentColor?: string
    hoverColor?: string
  }

export const StyledLink = styled(NavLink, {
  shouldForwardProp: (prop) => isPropValid(prop)
})<StyledLinkProps>`
  ${color};
  height: 50px;
  display: flex;
  position: relative;
  align-self: stretch;
  align-items: center;
  white-space: nowrap;
  background: transparent;
  justify-content: flex-start;
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  &.active::before {
    top: 0;
    left: 0;
    bottom: 0;
    width: 5px;
    content: '';
    position: absolute;
    background-color: ${(props) => props.accentColor};
  }
  &.active > div svg {
    stroke: ${(props) => props.color};
  }
  & > div span,
  & > div svg {
    color: ${(props) => props.color};
    stroke: ${(props) => props.color};
  }
  &:hover > div svg {
    stroke: ${(props) => props.color};
    transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  &:hover span {
    color: ${(props) => props.color};
    transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  &:hover {
    background: ${(props) => props.hoverColor};
  }
`
