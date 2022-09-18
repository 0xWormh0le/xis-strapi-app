import { IToast } from '@chakra-ui/core'

// Development
export const IS_PROD = process.env.NODE_ENV === 'production'

// Bugsnag
export const BUGSNAG_API_KEY = process.env.REACT_APP_BUGSNAG_API_KEY || ''

/**
 * Password regex for alphanumeric password with special characters
 * ^                  The password string will start this way
 * (?=.*[a-z])        The string must contain at least 1 lowercase alphabetical character
 * (?=.*[A-Z])        The string must contain at least 1 uppercase alphabetical character
 * (?=.*[0-9])        The string must contain at least 1 numeric character
 * @see https://www.thepolyglotdeveloper.com/2015/05/use-regex-to-test-password-strength-in-javascript/
 */
export const PASSWORD_REGEX = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])')

export const PASSWORD_REGEX_MESSAGE =
  'Password must contain at least 1 lowercase letter, 1 uppercase letter, 1' +
  ' number and 1 special character'

export const SUCCESS_TOAST: IToast = {
  duration: 6000,
  isClosable: true,
  title: 'Success!',
  status: 'success',
  position: 'bottom-right'
}

export const ERROR_TOAST: IToast = {
  duration: 6000,
  title: 'Oops!',
  status: 'error',
  isClosable: true,
  position: 'bottom-right'
}

export const DATE_FORMAT: string = 'DD/MM/YYYY'
