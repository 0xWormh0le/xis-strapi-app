import * as React from 'react'
import { fireEvent, render } from '../../../utils/test-utils'
import SideBar from '..'
import { Users, Home } from 'react-feather'
import { theme } from '../../../theme'

const NAV_ITEMS = [
  {
    to: '/dashboard',
    title: 'Dashboard',
    icon: <Home size={20} color="white" className="sidebar-menu-icon" />
  },
  {
    to: '/users',
    title: 'Users',
    icon: <Users size={20} color="white" className="sidebar-menu-icon" />
  }
]

describe('<SideBar />', () => {
  const setup = () => {
    const utils = render(
      <SideBar
        mode="push"
        color="white"
        bg="gray.800"
        navItems={NAV_ITEMS}
        hoverColor={theme.colors.gray[500]}
        accentColor={theme.colors.gray[500]}
      />
    )
    return { ...utils }
  }

  test('should render without crashing', () => {
    const { container } = setup()
    expect(container).toBeTruthy()
  })

  test('should render breadcrumbs on tab click', () => {
    const { getAllByText } = setup()
    // assert on both navigation tabs rendering correctly
    const dashboardTab = getAllByText(/dashboard/i)
    expect(dashboardTab).toHaveLength(2)
    const usersTab = getAllByText(/users/i)
    expect(usersTab).toHaveLength(2)
    // get users tab button & click
    const usersButton = usersTab[0].parentNode
    fireEvent.click(usersButton)
    // assert on users breadcrumb being rendered and not dashboard breadcrumb
    let usersBreadCrumb = getAllByText(/users/i)
    let dashboardBreadCrumb = getAllByText(/dashboard/i)
    expect(dashboardBreadCrumb).toHaveLength(2)
    expect(usersBreadCrumb).toHaveLength(3)
    // get dashboard tab button & click
    const dashboardButton = dashboardTab[0].parentNode
    fireEvent.click(dashboardButton)
    // assert on dashboard breadcrumb being rendered and not users breadcrumb
    usersBreadCrumb = getAllByText(/users/i)
    dashboardBreadCrumb = getAllByText(/dashboard/i)
    expect(usersBreadCrumb).toHaveLength(2)
    expect(dashboardBreadCrumb).toHaveLength(3)
  })
})
