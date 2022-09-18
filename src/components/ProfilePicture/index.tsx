import * as React from 'react'
import { Image } from 'react-feather'
import { SpaceProps } from 'styled-system'
import { useHasImageLoaded } from '../../hooks/useImage'
import { theme } from '../../theme'
import FillLoader from '../FillLoader'
import ImageOverlay from './overlay'
import { HiddenInput, ImageContainer, Placeholder, Wrapper } from './profilePicureStyles'

type Props = SpaceProps & {
  name: string
  color?: string
  editable?: boolean
  hostLogo?: boolean
  src?: string | null
  uploadText?: string
  width?: string | number
  height?: string | number
}

const ProfilePicture: React.FC<Props> = ({
  name,
  src,
  editable,
  width,
  height,
  uploadText,
  ...rest
}) => {
  const [profileImage] = React.useState(undefined)
  const hasLoaded = useHasImageLoaded({ src: profileImage })

  const [loading] = React.useState(false)

  // React.useEffect(() => {
  //   Storage.get('profileImage', { level: 'protected' })
  //     .then((result: any) => result && setProfileImage(result))
  //     .catch((error) => logger(error))
  // }, [])

  // const toast = useToast()

  const onChange = (e: any) => {
    // const file = e.target.files[0]
    // setLoading(true)
    // Storage.put('profileImage', file, {
    //   level: 'protected',
    //   contentType: file.type,
    //   progressCallback: (progress: any) => {
    //     logger(`Uploaded percentage: ${progress.loaded}/${progress.total}`)
    //   }
    // })
    //   .then((result: any) => Storage.get(result.key, { level: 'protected' }))
    //   .catch((err) => {
    //     setLoading(false)
    //     toast({
    //       duration: 6000,
    //       status: 'error',
    //       isClosable: true,
    //       title: 'Oops! An error occurred.',
    //       description: 'Something went wrong while uploading your photo.'
    //     })
    //   })
    //   .then((result: any) => {
    //     setProfileImage(result)
    //     setLoading(false)
    //     toast({
    //       duration: 6000,
    //       isClosable: true,
    //       status: 'success',
    //       title: 'Success!',
    //       description: 'Your profile picture has been updated.'
    //     })
    //   })
    //   .catch((err) => logger(err))
  }

  return (
    <Wrapper>
      {profileImage && hasLoaded ? (
        <React.Fragment>
          <ImageContainer alt="Profile Picture" src={profileImage} width={width} />
          <HiddenInput onChange={onChange} type="file" name={name} id={name} />
          <ImageOverlay name={name} onClick={() => false} uploadText="EDIT" edit={true} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Placeholder bg="gray.300" width={width} height={height}>
            <Image size={80} color="white" />
          </Placeholder>
          <HiddenInput onChange={onChange} type="file" name={name} id={name} />
          {editable && (
            <ImageOverlay
              name={name}
              edit={false}
              uploadText={uploadText || 'ADD PHOTO'}
              onClick={() => false}
            />
          )}
        </React.Fragment>
      )}
      {loading && <FillLoader color="white" bg={theme.colors.opacity.transparentBlack} />}
    </Wrapper>
  )
}

export default ProfilePicture

ProfilePicture.defaultProps = {
  editable: true,
  width: '100%'
}
