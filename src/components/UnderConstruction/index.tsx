import { Flex, Heading, Image } from '@chakra-ui/core'
import * as React from 'react'
import images from '../../theme/images'

type UnderConstructionProps = {
  width?: number | string
  height?: number | string
}

const UnderConstruction: React.FC<UnderConstructionProps> = ({ width, height }) => {
  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center">
      <Image src={images.underConstruction} width={width} height={height} />
      <Heading textAlign="center" size="md" mt={4} fontWeight="lighter">
        This page is under construction, check back soon.
      </Heading>
    </Flex>
  )
}

export default UnderConstruction

UnderConstruction.defaultProps = {
  width: 350,
  height: 350
}
