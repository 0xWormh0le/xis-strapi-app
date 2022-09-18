import styled from '@emotion/styled'
import * as React from 'react'
import { color, ColorProps, space, SpaceProps } from 'styled-system'

type IconProps = ColorProps &
  SpaceProps & {
    open: boolean
    color?: string
    onClick: () => void
  }

const StyledHamburgerIcon = styled.div<IconProps>`
  ${space};
  width: 2em;
  height: 2em;
  display: flex;
  z-index: 1800;
  position: relative;
  flex-direction: column;
  background: transparent;
  justify-content: center;
  align-items: flex-start;
  & span {
    ${color};
    width: 70%;
    height: 2px;
    border-radius: 5px;
    transform-origin: center left;
    opacity: ${(props) => (!props.open ? 0.7 : 1)};
    transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    &:nth-of-type(1) {
      transform: ${(props: IconProps) =>
        props.open
          ? 'translateY(0.45em) translateX(0em) rotate(-45deg) scaleX(0.6)'
          : 'translate3d(0,0,0) rotate(0deg)'};
    }
    &:nth-of-type(2) {
      margin: 5px 0;
    }
    &:nth-of-type(3) {
      transform: ${(props: IconProps) =>
        props.open
          ? 'translateY(-0.45em) translateX(0em) rotate(45deg) scaleX(0.6)'
          : 'translate3d(0,0,0) rotate(0deg)'};
    }
  }
  &:hover {
    cursor: pointer;
  }
  &:hover span {
    transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    opacity: 1;
    &:nth-of-type(1) {
      transform: ${(props: IconProps) =>
        props.open
          ? 'translateY(0.45em) translateX(0em) rotate(-45deg) scaleX(0.6)'
          : 'scaleX(1.1)'};
    }
    &:nth-of-type(2) {
      ${(props: IconProps) => !props.open && 'transform: scaleX(0.8)'};
    }
    &:nth-of-type(3) {
      transform: ${(props: IconProps) =>
        props.open
          ? 'translateY(-0.45em) translateX(0em) rotate(45deg) scaleX(0.6)'
          : 'scaleX(0.95)'};
    }
  }
`

const HamburgerIcon: React.FC<IconProps> = ({
  open,
  onClick,
  color: colorProp,
  bg,
  ...rest
}: IconProps) => {
  return (
    <StyledHamburgerIcon bg={bg} open={open} onClick={onClick} color={colorProp} {...rest}>
      <span />
      <span />
      <span />
    </StyledHamburgerIcon>
  )
}

export default HamburgerIcon

HamburgerIcon.defaultProps = {
  ml: '20px',
  bg: 'gray.50'
}
