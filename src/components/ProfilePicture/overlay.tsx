import * as React from 'react'
import { theme } from '../../theme'
import { Text } from '../Typography'
import { EditIcon, Overlay, PlusIcon } from './overlayStyles'

type Props = {
  name: string
  uploadText: string
  onClick?: () => void
  edit?: boolean
}

const ImageOverlay: React.FC<Props> = ({ name, uploadText, onClick, edit }) => {
  return (
    <Overlay
      p={3}
      htmlFor={name}
      onClick={onClick}
      className="image-overlay"
      bg={theme.colors.opacity.transparentWhite}
    >
      <Text pointer={true} color="coal" mt="2px" mr={1}>
        {uploadText || 'ADD PHOTO'}
      </Text>
      {edit ? <EditIcon color="gray" /> : <PlusIcon color="gray" />}
    </Overlay>
  )
}

export default ImageOverlay
