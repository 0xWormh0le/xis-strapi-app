import * as React from 'react'
import DropdownMenu from '../'
import { fireEvent, render } from '../../../utils/test-utils'

jest.mock('popper.js', () => {
  const PopperJS = jest.requireActual('popper.js')

  return class {
    static placements = PopperJS.placements

    constructor() {
      return {
        destroy: () => {},
        scheduleUpdate: () => {}
      }
    }
  }
})

describe('<DropdownMenu />', () => {
  const setup = () => {
    const utils = render(
      <DropdownMenu
        title="Test Menu"
        menuItems={[
          { title: 'Item One', onClick: () => jest.fn() },
          { title: 'Item Two', onClick: () => jest.fn() }
        ]}
      />
    )
    return { ...utils }
  }

  test('should render without crashing', () => {
    const { container } = setup()
    expect(container).toBeTruthy()
  })

  test('should render button element', () => {
    const { container } = setup()
    const button = container.querySelector('button')
    // assert rendered element is button
    expect(button).toBeDefined()
  })

  test('should render title text', () => {
    const { getByText } = setup()
    // assert title gets rendered
    expect(getByText(/test menu/i)).toBeDefined()
  })

  test('should show dropdown menu items', () => {
    const { getByText } = setup()
    const button = getByText(/test menu/i)
    fireEvent.click(button)
    expect(getByText(/item one/i)).toBeDefined()
    expect(getByText(/item two/i)).toBeDefined()
  })
})
