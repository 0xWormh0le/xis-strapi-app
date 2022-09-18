import { tokenStorage } from '.'

/**
 * Delete an uploaded file from the BE with the file id and user token
 * @param fileId
 * @param token
 */
async function deleteUploadedFile(fileId: string) {
  const response = await fetch(
    process.env.REACT_APP_API_HOST
      ? process.env.REACT_APP_API_HOST + `/upload/files/${fileId}`
      : `/upload/files/${fileId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${tokenStorage.get()?.jwt}`
      }
    }
  )
  const data = await response.json()
  return data
}

/**
 * Fetch an uploaded file from the BE with the file id and user token
 * @param fileId
 * @param token
 */
async function fetchUploadedFile(fileId: string) {
  const response = await fetch(
    process.env.REACT_APP_API_HOST
      ? process.env.REACT_APP_API_HOST + `/upload/files/${fileId}`
      : `/upload/files/${fileId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenStorage.get()?.jwt}`
      }
    }
  )
  const data = await response.json()
  return data
}

/**
 * Upload a file to the BE with user token
 * @param token
 */
async function uploadFile() {
  const response = await fetch(
    process.env.REACT_APP_API_HOST ? process.env.REACT_APP_API_HOST + '/upload' : '/upload',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenStorage.get()?.jwt}`
      }
    }
  )
  const data = await response.json()
  return data
}
const ApiRequestExport = {
  deleteUploadedFile,
  fetchUploadedFile,
  uploadFile
}
export default ApiRequestExport
