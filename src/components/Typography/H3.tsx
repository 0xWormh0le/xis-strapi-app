import { Heading } from '@chakra-ui/core'
import { HeadingProps } from '@chakra-ui/core/dist/Heading'
import * as React from 'react'

const H3: React.FC<HeadingProps> = ({ children, ...rest }) => {
  return <Heading {...rest}>{children}</Heading>
}

export default H3

H3.defaultProps = {
  mb: 2,
  as: 'h3',
  fontSize: '3xl',
  fontWeight: 'light'
}
