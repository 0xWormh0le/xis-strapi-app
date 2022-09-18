import { createMemoryHistory } from 'history'
import * as React from 'react'
import { Router } from 'react-router-dom'
import Breadcrumbs from '../'
import { render } from '../../../utils/test-utils'

describe('<Breadcrumbs />', () => {
  const setup = () => {
    const history = createMemoryHistory({
      initialEntries: ['/dashboard', '/dashboard/stats', '/dashboard/stats/update'],
      initialIndex: 2
    })
    const utils = render(
      <Router history={history}>
        <Breadcrumbs />
      </Router>
    )

    return { ...utils, history }
  }

  test('should render without crashing', () => {
    const { container } = setup()
    expect(container).toBeTruthy()
  })

  test('should render breadcrumbs', () => {
    const { getByText, container } = setup()

    const firstChild = container.firstElementChild

    if (firstChild) {
      // assert 3 breadcrumbs get rendered
      expect(firstChild.children.length).toBe(3)
    }

    const b1 = getByText(/dashboard/i)
    const b2 = getByText(/stats/i)
    const b3 = getByText(/update/i)

    // assert correct breadcrumbs get rendered
    expect(b1).toBeDefined()
    expect(b2).toBeDefined()
    expect(b3).toBeDefined()
  })

  test('should update breadcrumbs when navigating', () => {
    const { history, container } = setup()

    // assert original history length
    expect(history.length).toBe(3)

    const firstChild = container.firstElementChild

    if (firstChild) {
      // assert 3 breadcrumbs get rendered
      expect(firstChild.children.length).toBe(3)
    }

    // simulate nav back
    history.goBack()

    if (firstChild) {
      // assert 2 breadcrumbs get rendered
      expect(firstChild.children.length).toBe(2)
    }
  })
})
