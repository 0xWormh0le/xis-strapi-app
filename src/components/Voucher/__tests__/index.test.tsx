import * as React from 'react'
import Voucher from '../'
import { render } from '../../../utils/test-utils'
import { H4 } from '../../../components/Typography'

describe('<Voucher />', () => {
  const setup = () => {
    const utils = render(<Voucher />)
    return { ...utils }
  }

  test('should render without crashing', () => {
    const { container } = setup()
    expect(container).toBeTruthy()
  })

  test('should render H4 component', () => {
    const { getByText } = setup()
    expect(getByText(/voucher redeemed/i)).toBeTruthy()
  })
})
