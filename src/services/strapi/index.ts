import { create } from 'apisauce'

const api = create({
  baseURL: '/'
})

export const login = (identifier: string, password: string) =>
  api
    .post(
      process.env.REACT_APP_API_HOST
        ? process.env.REACT_APP_API_HOST + '/auth/local'
        : '/auth/local',
      { identifier, password }
    )
    .then((response: any) => {
      if (response.ok) {
        return response.data
      } else {
        throw new Error(response.data.message[0].messages[0].message)
      }
    })
    .catch((error) => {
      throw error
    })

export const register = (username: string, email: string, password: string) =>
  api.post(
    process.env.REACT_APP_API_HOST
      ? process.env.REACT_APP_API_HOST + '/auth/local/register'
      : '/auth/local/register',
    { username, email, password }
  )

export const forgotPassword = (email: string) => api.post('/auth/forgot-password', { email })

export const resetPassword = (code: string, password: string, passwordConfirmation: string) =>
  api.post(
    process.env.REACT_APP_API_HOST
      ? process.env.REACT_APP_API_HOST + '/auth/reset-password'
      : '/auth/reset-password',
    { code, password, passwordConfirmation }
  )

export const sendEmailConfirmation = (email: string) =>
  api.post(
    process.env.REACT_APP_API_HOST
      ? process.env.REACT_APP_API_HOST + '/auth/send-email-confirmation'
      : '/auth/send-email-confirmation',
    { email }
  )

export const confirmEmail = (confirmation: string) =>
  api.get(
    process.env.REACT_APP_API_HOST
      ? process.env.REACT_APP_API_HOST + '/auth/email-confirmation'
      : '/auth/email-confirmation',
    { confirmation }
  )
