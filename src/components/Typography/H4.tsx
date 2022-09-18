import { Heading } from '@chakra-ui/core'
import { HeadingProps } from '@chakra-ui/core/dist/Heading'
import * as React from 'react'

const H4: React.FC<HeadingProps> = ({ children, ...rest }) => {
  return <Heading {...rest}>{children}</Heading>
}

export default H4

H4.defaultProps = {
  mb: 2,
  as: 'h4',
  fontSize: '2xl',
  fontWeight: 'light'
}
