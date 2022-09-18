import { Button, Flex, IconButton, Progress } from '@chakra-ui/core'
import { FieldProps } from 'formik'
import * as React from 'react'
import { Check } from 'react-feather'
import { theme } from '../../../theme'
import { Text } from '../../Typography'
import { AddFileButton, FileWrapper, HiddenInput, Wrapper } from './styles'

type FileUploaderProps = FieldProps

const FileUploader: React.FC<FileUploaderProps> = ({ field: { name, value }, form }) => {
  const [stateFiles, setStateFiles] = React.useState<File[]>([])
  const [uploading] = React.useState(false)
  const [uploadProgress] = React.useState<any>({})

  // const toast = useToast()

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const arrFiles = Array.from(files)
      setStateFiles((prevFiles) => prevFiles?.concat(arrFiles))
    }
  }

  // const uploadRequest = (file: File) => {
  // const key = `sale-documents/${uuid()}-${file.name}`
  // return Storage.put(key, file, {
  //   contentType: file.type,
  //   progressCallback: (progress: any) => {
  //     const copy = { ...uploadProgress }
  //     copy[file.name] = {
  //       state: 'pending',
  //       percentage: ((progress.loaded / progress.total) * 100).toFixed(0)
  //     }
  //     setUploadProgress((prevProgress: any) => ({ ...prevProgress, ...copy }))
  //   }
  // })
  //   .then((result: any) => Storage.get(result.key))
  //   .catch(() => {
  //     toast({
  //       description: 'Something went wrong while uploading your photo.',
  //       ...ERROR_TOAST
  //     })
  //   })
  //   .then((result: any) => {
  //     const copy = { ...uploadProgress }
  //     copy[file.name] = { state: 'done', percentage: 100 }
  //     setUploadProgress((prevProgress: any) => ({ ...prevProgress, ...copy }))
  //     return { name: file.name, key, bucket, region, url: result }
  //   })
  //   .catch((err) => logger('uploadRequest Error: ', err))
  // }

  const handleUpload = async () => {
    // const promises: Promise<void | SaleDocument>[] = []
    // setUploading(true)
    // stateFiles.forEach((file) => {
    //   promises.push(uploadRequest(file))
    // })
    // try {
    //   const urls = await Promise.all(promises)
    //   form.setFieldValue(name, urls)
    //   setUploading(false)
    // } catch (e) {
    //   logger('Upload Error: ', e)
    //   toast({
    //     description: 'Something went wrong while uploading your photo.',
    //     ...ERROR_TOAST
    //   })
    // }
  }

  const renderProgress = (fileName: string) => {
    const progress = uploadProgress[fileName]
    if (uploading) {
      return (
        <Progress
          left={0}
          right={0}
          bottom={0}
          height="2px"
          color="primary"
          hasStripe={true}
          isAnimated={true}
          position="absolute"
          value={progress ? parseInt(progress.percentage) : 0}
        />
      )
    }
  }

  if (value && value.length > 0) {
    return (
      <Wrapper>
        {/* {value.map((file: SaleDocument, i: number) => (
          <FileWrapper key={i}>
            <Text>{file.name}</Text>
            <Check size={20} color={theme.colors.success[500]} />
          </FileWrapper>
        ))} */}
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      {stateFiles &&
        stateFiles.length > 0 &&
        stateFiles.map((file: File) => {
          const progress = uploadProgress[file.name]
          return (
            <FileWrapper key={file.name}>
              <Text>{file.name}</Text>
              {progress && progress.state === 'done' ? (
                <Check size={20} color={theme.colors.success[500]} />
              ) : (
                <IconButton
                  size="xs"
                  icon="close"
                  aria-label="Remove File"
                  onClick={() => setStateFiles(stateFiles.filter((e) => e.name !== file.name))}
                />
              )}
              {renderProgress(file.name)}
            </FileWrapper>
          )
        })}
      <Flex mt={2} justifyContent="flex-end" width="100%" flexDirection="row">
        <AddFileButton htmlFor={name} mr={stateFiles && stateFiles.length > 0 ? 4 : 0}>
          <Text pointer>Add Files</Text>
        </AddFileButton>
        {stateFiles && stateFiles.length > 0 && (
          <Button isLoading={uploading} flex={1} onClick={() => handleUpload()}>
            <Text pointer>Upload</Text>
          </Button>
        )}
      </Flex>
      <HiddenInput onChange={onChange} type="file" multiple name={name} id={name} />
    </Wrapper>
  )
}

export default FileUploader
