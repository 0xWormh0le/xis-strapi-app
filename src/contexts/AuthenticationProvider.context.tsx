import React, { FC, useEffect, useState } from 'react'
import { tokenStorage, isTokenValid } from '../utils'

type CognitoUser = {
  jwt: string
  user: any
}

type ContextType = {
  authenticating: boolean
  isAuthenticated: boolean
  setAuthenticated: (auth: boolean) => void
  // todo: add correct type def
  setUser: (user: CognitoUser) => void
  getUser: () => CognitoUser
}

const DEFAULT_STATE = {
  authenticating: true,
  isAuthenticated: false,
  user: { jwt: '', user: {} },
  setAuthenticated: () => false,
  setUser: () => null,
  getUser: () => ({ jwt: '', user: {} })
}

export const AuthenticationContext = React.createContext<ContextType>(DEFAULT_STATE)

const Provider: FC = ({ children }) => {
  const [authenticating, setAuthenticating] = useState(DEFAULT_STATE.authenticating)
  const [isAuthenticated, setIsAuthenticated] = useState(DEFAULT_STATE.isAuthenticated)

  const setAuthenticated = (auth: boolean) => {
    setIsAuthenticated(auth)
  }

  const getUser = (): CognitoUser => JSON.parse(window.localStorage.getItem('user') || '{}')
  const setUser = (user: CognitoUser) => window.localStorage.setItem('user', JSON.stringify(user))

  useEffect(() => {
    async function checkAuthStatus() {
      setAuthenticating(true)
      try {
        const { jwt } = tokenStorage.get()
        const authed = isTokenValid(jwt)
        if (authed) {
          setIsAuthenticated(true)
          setAuthenticating(false)
        }
      } catch (error) {
        setIsAuthenticated(false)
        setAuthenticating(false)
      }
    }
    checkAuthStatus()
  }, [isAuthenticated])

  return (
    <AuthenticationContext.Provider
      value={{ authenticating, isAuthenticated, setAuthenticated, getUser, setUser }}
    >
      {children}
    </AuthenticationContext.Provider>
  )
}

export default Provider
