import { ApolloError } from 'apollo-client'
import cloneDeep from 'lodash/cloneDeep'
import forOwn from 'lodash/forOwn'
import isEmpty from 'lodash/isEmpty'
import isObject from 'lodash/isObject'
import isString from 'lodash/isString'
import * as React from 'react'
export { getPackageVersionNumber } from './getPackageVersionNumber'
export { isTokenValid } from './isTokenValid'

/**
 * Helper function to convert all empty strings to null
 * in a nested object. This is a workaround to handle AppSync's
 * inability to support empty strings with DynamoDB.
 * @param obj - object to have falsy values removed.
 */
export function cleanObject<T extends { [key: string]: any }>(obj: T) {
  const cloneObj = cloneDeep(obj) // Clone original object
  const pruneNested = (obj: T) => {
    forOwn(obj, (value, key) => {
      if ((isString(value) && isEmpty(value)) || (isObject(value) && isEmpty(pruneNested(value)))) {
        // See https://github.com/microsoft/TypeScript/issues/32704
        // @ts-ignore: Type 'string' cannot be used to index type 'T'
        obj[key] = null
      }
    })
    return obj
  }
  return pruneNested(cloneObj)
}

/**
 * This function will format a string from an enum,
 * making only the first letter a capital and making
 * the rest lower case, it also removes underscores
 * and replacing them with spaces.
 * @param {string} toFix - The string we are wanting
 * to format.
 * @param {boolean} allFirstCaps - If true, all words
 * in the string will get a capital first letter.
 */
export function formatString(toFix: string, firstLetterCaps: boolean, isUrl?: boolean): string {
  try {
    if (firstLetterCaps) {
      let sentence = ''
      const temp = toFix
        .toLowerCase()
        .replace(/_/g, ' ')
        .split(' ')
      temp.forEach(
        (word) => (sentence += word.charAt(0).toUpperCase() + word.substr(1).toLowerCase() + ' ')
      )
      return sentence
    }
    if (isUrl) {
      const temp = toFix.toLowerCase().replace(' ', '-')
      return temp
    }
    return (
      toFix.charAt(0).toUpperCase() +
      toFix
        .substr(1)
        .toLowerCase()
        .replace(/_/g, ' ')
    )
  } catch (error) {
    return toFix
  }
}

/**
 * Helper function to convert null values returned from the server to
 * empty strings so form inputs are initialized correctly.
 * @param obj - object which needs values converted from null to empty string
 */
export const initializeValues = <T extends { [key: string]: any } = {}>(obj: T) => {
  if (obj && typeof obj === 'object') {
    Object.keys(obj).forEach((k) => {
      if (obj[k] === null) {
        // @ts-ignore: Type 'string' cannot be used to index type 'T'
        obj[k] = ''
      }
    })
  }
  return obj
}

/**
 * This function serves to mutate an enum value which is
 * being returned from the backend into an object that's compatible
 * with react-select.
 * @param { string | { label: string; value: string } } data - the variable
 * to either be returned if it's already a select object,
 * or to be made into one if it isn't.
 */

export function formatSelectValue(
  data: string | { label: string; value: string } | null | undefined
): { label: string; value: string } | null {
  try {
    if (data && typeof data !== 'object') {
      return {
        label: formatString(data, true),
        value: data
      }
    } else if (data && typeof data === 'object' && 'label' in data && 'value' in data) {
      return data
    }
    return null
  } catch (error) {
    return null
  }
}

/**
 * Formats the error that comes back from the
 * server into a more user friendly string.
 * @param error - the error from the GraphQL server
 * to be updated.
 */
export function formatGqlError(error: ApolloError) {
  return error.message.replace('GraphQL error:', '').trim()
}

/**
 * Helper function to generate UUIDs
 */
export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Custom hook which returns a value after a specified debounce period.
 * @param value - string value which you want returned
 * @param delay - debounce period in ms
 */

export function useDebounce(value: string, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = React.useState(value)

  React.useEffect(() => {
    // Set debouncedValue to value (passed in) after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // cleanup
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay]) // Only re-call effect if value changes

  return debouncedValue
}

/**
 * Helper object which has getters and setters
 * for handling auth tokens in async storage
 */
export const tokenStorage = {
  get: () => {
    return JSON.parse(window.localStorage.getItem('user') || '{}')
  },
  set: (newToken: object) => {
    return window.localStorage.setItem('user', JSON.stringify(newToken))
  },
  clear: () => {
    return window.localStorage.removeItem('user')
  }
}

type ConfigField = 'ticketView' | 'custom'

export const configStorage = {
  get: (field: ConfigField) => {
    const config = JSON.parse(localStorage.getItem('config') || '{}')
    return config[field]
  },
  set: (field: ConfigField, value: any) => {
    const config = JSON.parse(localStorage.getItem('config') || '{}')
    config[field] = value
    localStorage.setItem('config', JSON.stringify(config))
  },
  clear: () => {
    return localStorage.removeItem('config')
  }
}
