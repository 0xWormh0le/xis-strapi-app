import React, { Suspense, useMemo } from 'react'
import { FileText, Package } from 'react-feather'
import { Redirect, Route, RouteProps, Switch } from 'react-router'
import { BrowserRouter as Router } from 'react-router-dom'
import { FillLoader, SideBar, FillLoader as Loader } from 'components'
import PageNotFound from 'containers/PageNotFound'
import { useAuthentication } from 'hooks'
import { theme, images } from 'theme'
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from './routes'
import { useGetConfigurationQuery } from 'generated/graphql'

interface RouteType extends RouteProps {
  component: any
}

const NAV_ITEMS = [
  {
    to: '/tickets',
    title: 'Tickets',
    icon: <FileText size={20} color="white" className="sidebar-menu-icon" />
  }
]

const NAV_WARRANTY = {
  to: '/warranties',
  title: 'Warranties',
  icon: <Package size={20} color="white" className="sidebar-menu-icon" />
}

const PrivateRoute = ({ component: Component, ...rest }: RouteType) => {
  const { authenticating, isAuthenticated } = useAuthentication()
  const { data: config } = useGetConfigurationQuery()

  const navigation = useMemo(
    () =>
      config?.configurations && config?.configurations[0]?.showWarranty
        ? NAV_ITEMS.concat([NAV_WARRANTY])
        : NAV_ITEMS,
    [config]
  )

  return !authenticating ? (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <SideBar
            mode="push"
            color="white"
            bg="gray.800"
            navItems={navigation}
            hoverColor={theme.colors.gray[500]}
            accentColor={theme.colors.brand[700]}
          >
            <React.Suspense fallback={<FillLoader bg="gray.50" />}>
              <Component {...props} {...rest} />
            </React.Suspense>
          </SideBar>
        ) : (
          <Redirect to={{ pathname: '/', state: { from: props.location } }} />
        )
      }
    />
  ) : (
    <Loader />
  )
}

const PublicRoute = ({ component: Component, ...rest }: RouteType) => (
  <Route {...rest} render={(props) => <Component {...props} />} />
)

console.log('process.env.REACT_APP_PREFIX', process.env.REACT_APP_PREFIX)

const Navigation = () => (
  <Router basename="/vendor">
    <Suspense fallback={<FillLoader backgroundImage={images.landingBackground} />}>
      <Switch>
        {PUBLIC_ROUTES.map((route) => {
          return <PublicRoute key={route.path} {...route} />
        })}
        {PRIVATE_ROUTES.map((route) => {
          return <PrivateRoute key={route.path} {...route} />
        })}
        <Route render={PageNotFound} />
      </Switch>
    </Suspense>
  </Router>
)

export default Navigation
