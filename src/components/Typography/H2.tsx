import { Heading } from '@chakra-ui/core'
import { HeadingProps } from '@chakra-ui/core/dist/Heading'
import * as React from 'react'

const H2: React.FC<HeadingProps> = ({ children, ...rest }) => {
  return <Heading {...rest}>{children}</Heading>
}

export default H2

H2.defaultProps = {
  mb: 2,
  as: 'h2',
  fontSize: '4xl',
  fontWeight: 'normal'
}
