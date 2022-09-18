import { ApolloProvider } from '@apollo/react-hooks'
import bugsnag from '@bugsnag/js'
import bugsnagReact from '@bugsnag/plugin-react'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
  CSSReset,
  ThemeProvider
} from '@chakra-ui/core'
import { css, Global } from '@emotion/core'
import React from 'react'
import 'react-dates/initialize'
import * as ReactDOM from 'react-dom'
import client from './apollo'
import { FallbackErrorMessage } from './components'
import { BUGSNAG_API_KEY } from './constants'
import { AppProvider } from './contexts'
import Navigation from './navigation'
import { register, unregister } from './serviceWorker'
import { theme } from './theme'

const bugsnagClient = bugsnag(BUGSNAG_API_KEY)
bugsnagClient.use(bugsnagReact, React)
const ErrorBoundary = bugsnagClient.getPlugin('react')

ReactDOM.render(
  <ErrorBoundary FallbackComponent={FallbackErrorMessage}>
    <ThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <AppProvider>
          <CSSReset />
          <Global
            styles={css`
              html {
                font-family: ${theme.fonts.body};
              }
            `}
          />
          <Navigation />
        </AppProvider>
      </ApolloProvider>
    </ThemeProvider>
  </ErrorBoundary>,
  document.getElementById('root') as HTMLElement
)

if (process.env.REACT_APP_UNREGISTER_SERVICE_WORKER) {
  unregister()
} else {
  register({
    onUpdate: () =>
      function RegisterWorker() {
        return (
          <Alert status="info">
            <AlertIcon />
            <AlertTitle mr={2}>A new version is available!</AlertTitle>
            <AlertDescription>Please refresh your browser to get it.</AlertDescription>
            <CloseButton position="absolute" right="8px" top="8px" />
          </Alert>
        )
      }
  })
}
