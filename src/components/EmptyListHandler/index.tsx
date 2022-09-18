import { Flex, Heading, Image } from '@chakra-ui/core'
import * as React from 'react'
import images from '../../theme/images'
import Card from '../Card'

type EmptyListHandlerProps = {
  message: string
}

const EmptyListHandler: React.FC<EmptyListHandlerProps> = ({ message }) => {
  return (
    <Card p={6}>
      <Flex flex={1} flexDirection="column" justifyContent="center" alignItems="center">
        <Image src={images.empty} width={350} height={350} />
        <Heading textAlign="center" size="md" mb={4} fontWeight="lighter">
          {message}
        </Heading>
      </Flex>
    </Card>
  )
}

export default EmptyListHandler

EmptyListHandler.defaultProps = {
  message: 'Nothing to see here.'
}
