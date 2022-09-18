import { Heading } from '@chakra-ui/core'
import { HeadingProps } from '@chakra-ui/core/dist/Heading'
import * as React from 'react'

const H1: React.FC<HeadingProps> = ({ children, ...rest }) => {
  return <Heading {...rest}>{children}</Heading>
}

export default H1

H1.defaultProps = {
  mb: 2,
  as: 'h1',
  fontSize: '5xl',
  fontWeight: 'normal'
}
