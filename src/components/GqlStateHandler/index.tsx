import { ApolloError } from 'apollo-client'
import * as React from 'react'
import { FillLoader } from '../'
import { H4 } from '../Typography'

// FC components break when referencing React.ReactNode types for props
// https://stackoverflow.com/questions/54905376/type-error-jsx-element-type-null-undefined-is-not-a-constructor-functi

type GqlStateHandlerProps = {
  loading: boolean
  customError?: any
  customLoader?: any
  error: ApolloError | undefined
}

const GqlStateHandler: React.FC<GqlStateHandlerProps> = ({
  loading,
  error,
  children,
  customLoader,
  customError
}) => {
  if (loading) {
    return customLoader || <FillLoader />
  }
  if (error) {
    return customError || <H4>Oops, something went wrong!</H4>
  }
  return children
}

export default GqlStateHandler
