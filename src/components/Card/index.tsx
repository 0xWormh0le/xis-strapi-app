import { Flex } from '@chakra-ui/core'
import { BoxProps } from '@chakra-ui/core/dist/Box'
import React from 'react'
import { animated } from 'react-spring'
import { useFadeUp } from '../../hooks/animation'

export type CardProps = BoxProps & {
  onClick?: () => void
  color?: string
}

const AnimatedFlex = animated(Flex)

const Card: React.FC<CardProps> = ({ onClick, children, ...rest }) => {
  const fade = useFadeUp()
  return (
    <Flex style={fade} onClick={onClick} {...rest}>
      {children}
    </Flex>
  )
}

Card.defaultProps = {
  bg: 'white',
  width: 'auto',
  rounded: 'md',
  borderWidth: '1px',
  onClick: () => false,
  flexDirection: 'column'
}

export default Card
