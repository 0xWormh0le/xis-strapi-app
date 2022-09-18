// test-utils.js
import { ThemeProvider } from '@chakra-ui/core'
import { render, RenderOptions } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import * as React from 'react'
import { Router } from 'react-router-dom'
import { theme } from '../theme'

type CustomRenderProps = {
  initialEntries?: string[]
}

const AllTheProviders: React.FC<CustomRenderProps> = ({ children, initialEntries }) => {
  const history = createMemoryHistory({ initialEntries: ['/'] })
  return (
    <Router history={history}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </Router>
  )
}

// Workaround to fix body being filled with bloat from toast package
function getUpdatedBody() {
  const elem = document.querySelector('#react-toast')
  if (elem && elem.parentNode) {
    elem.parentNode.removeChild(elem)
  }
  let portalRoot = document.getElementById('chakra-portal')
  if (!portalRoot) {
    portalRoot = document.createElement('div')
    portalRoot.setAttribute('id', 'chakra-portal')
    document.body.appendChild(portalRoot)
  }
  return portalRoot
}

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'queries'>) =>
  render(ui, { wrapper: AllTheProviders, container: getUpdatedBody(), ...options })

// re-export everything
export * from '@testing-library/react'
// override render method
export { customRender as render }

/**
 * Helper function to create mock props when unit testing components.
 * @param testProps - any props you'd like to include.
 */
export const createTestProps = (match: any = null, testProps: any = {}) =>
  ({
    history: createMemoryHistory({ initialEntries: ['/'] }),
    location: {},
    match: { params: match } || {},
    ...testProps
  } as any) // avoid TS errors for mocked functions
