import { IconButton, IModal, Modal, ModalContent, ModalOverlay } from '@chakra-ui/core'
import * as React from 'react'
import { X } from 'react-feather'
import { useMediaQuery } from 'react-responsive'
import Card from '../Card'
import CardHeader from '../Card/CardHeader'
import { H5 } from '../Typography'

type ModalWrapProps = IModal & {
  title: string
}

const ModalWrap: React.FC<ModalWrapProps> = ({ children, title, onClose, isOpen, ...rest }) => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })

  return (
    <Modal
      isCentered
      size="xl"
      preserveScrollBarGap
      scrollBehavior={isTabletOrMobile ? 'inside' : 'outside'}
      {...rest}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent shadow="none" bg="transparent" rounded="md">
        <Card overflow={isTabletOrMobile ? 'auto' : 'inherit'} rounded="md" shadow="md" m={4}>
          <CardHeader alignItems="center" flexDirection="row" justifyContent="space-between">
            <H5 mb={0}>{title}</H5>
            <IconButton onClick={onClose} size="sm" aria-label="Close Modal" icon={X} />
          </CardHeader>
          {children}
        </Card>
      </ModalContent>
    </Modal>
  )
}

export default ModalWrap

ModalWrap.defaultProps = {
  title: 'Modal Heading'
}
