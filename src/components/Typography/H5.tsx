import { Heading } from '@chakra-ui/core'
import { HeadingProps } from '@chakra-ui/core/dist/Heading'
import * as React from 'react'

const H5: React.FC<HeadingProps> = ({ children, ...rest }) => {
  return <Heading {...rest}>{children}</Heading>
}

export default H5

H5.defaultProps = {
  mb: 2,
  as: 'h5',
  fontSize: 'xl',
  fontWeight: 'light'
}
