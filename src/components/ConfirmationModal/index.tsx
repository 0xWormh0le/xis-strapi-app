import { Button, Flex } from '@chakra-ui/core'
import * as React from 'react'
import { CardFooter, ModalWrap } from '..'
import { H5 } from '../Typography'

type ConfirmationModalProps = {
  onClose: (() => void) | undefined
  isOpen: boolean | undefined
  isLoading: boolean
  actionButtonText: string
  actionButtonVariant: string
  onSubmit: () => void
  message: string
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  onClose,
  isOpen,
  isLoading,
  actionButtonText,
  actionButtonVariant,
  onSubmit,
  message
}) => {
  return (
    <ModalWrap title="Confirmation" onClose={onClose} isOpen={isOpen}>
      <Flex flexDirection="row" position="relative" p={4}>
        <H5 mb={0}>{message}</H5>
      </Flex>
      <CardFooter flexDirection="row" flex={1}>
        <Flex justifyContent="flex-end" flex={1}>
          <Button mr={4} variant="outline" type="submit" onClick={onClose}>
            CANCEL
          </Button>
          <Button isLoading={isLoading} variantColor={actionButtonVariant} onClick={onSubmit}>
            {actionButtonText.toUpperCase()}
          </Button>
        </Flex>
      </CardFooter>
    </ModalWrap>
  )
}

export default ConfirmationModal
