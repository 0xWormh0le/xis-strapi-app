import * as React from 'react'
import { render } from '../../../utils/test-utils'
import Table from '..'

const columns = [{ Header: 'Header 1' }, { Header: 'Header 2' }]

describe('<Table />', () => {
  const setup = () => {
    const utils = render(<Table columns={columns} data={[]} />)
    return { ...utils }
  }

  test('should render without crashing', () => {
    const { container } = setup()
    expect(container).toBeTruthy()
  })

  test('should render column headers and pagination buttons', () => {
    const { getByText, getAllByTestId } = setup()
    const column1 = getByText(/header 1/i)
    const column2 = getByText(/header 2/i)
    expect(column1).toBeTruthy()
    expect(column2).toBeTruthy()
    const arrowButtons = getAllByTestId('table-arrow-button')
    expect(arrowButtons).toHaveLength(4)
  })
})
