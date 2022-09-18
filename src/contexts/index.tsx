import React, { FC } from 'react'
import ApplicationProvider from './ApplicationProvider.context'
import AuthenticationProvider from './AuthenticationProvider.context'

export const AppProvider: FC = ({ children }) => {
  return (
    <AuthenticationProvider>
      <ApplicationProvider>{children}</ApplicationProvider>
    </AuthenticationProvider>
  )
}
