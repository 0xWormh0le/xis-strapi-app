import { Code, Flex, Heading, Image } from '@chakra-ui/core'
import React from 'react'
import { PageWrap } from '../../layouts'
import images from '../../theme/images'

type FallbackErrorMessageProps = {
  message?: string
}
const FallbackErrorMessage: React.FC<FallbackErrorMessageProps> = (props) => (
  <PageWrap>
    <Flex flex={1} flexDirection="column" justifyContent="center" alignItems="center">
      <Image src={images.warning} width={350} height={350} />
      <Heading textAlign="center" size="md" mt={4} fontWeight="lighter">
        An error has occurred.
      </Heading>
      {props.message && <Code variantColor="red" children={props.message} />}
    </Flex>
  </PageWrap>
)

export default FallbackErrorMessage
