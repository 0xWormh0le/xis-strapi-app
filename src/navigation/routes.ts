import { lazy } from 'react'
import { RouteProps } from 'react-router'

const ForgotPassword = lazy(() => import('../containers/ForgotPassword'))
const Login = lazy(() => import('../containers/Login'))
const Profile = lazy(() => import('../containers/Profile'))
const ResetPassword = lazy(() => import('../containers/ResetPassword'))
const VerifyEmail = lazy(() => import('../containers/VerifyEmail'))
const Tickets = lazy(() => import('../containers/Tickets'))
const TicketDetail = lazy(() => import('../containers/TicketDetail'))
const QuoteDetail = lazy(() => import('../containers/QuoteDetail'))
const Messages = lazy(() => import('../containers/Messages'))
const MessageDetail = lazy(() => import('../containers/MessageDetail'))
const Notifications = lazy(() => import('../containers/Notifications'))

export interface PrivateRouteObject extends RouteProps {
  exact: boolean
  path: string
  breadcrumb: string
  component: any
  title: string
}

interface PrivateRouteWithProp extends PrivateRouteObject {
  [x: string]: any
}

const PRIVATE_ROUTES: PrivateRouteWithProp[] = [
  {
    exact: true,
    path: '/profile',
    breadcrumb: 'Profile',
    component: Profile,
    title: 'Profile'
  },
  {
    exact: true,
    path: '/tickets',
    breadcrumb: 'Tickets',
    component: Tickets,
    title: 'Tickets'
  },
  {
    exact: true,
    path: '/warranties',
    breadcrumb: 'Warranties',
    component: Tickets,
    title: 'Warranties',
    warrantyOnly: true
  },
  {
    exact: true,
    path: '/tickets/:idTicket',
    breadcrumb: 'Ticket',
    component: TicketDetail,
    title: 'Ticket Detail'
  },
  {
    exact: true,
    path: '/warranties/:idTicket',
    breadcrumb: 'Ticket',
    component: TicketDetail,
    title: 'Ticket Detail'
  },
  {
    exact: true,
    path: '/tickets/:idTicket/QuoteDetail/:idQuote',
    breadcrumb: 'Quote Detail',
    component: QuoteDetail,
    title: 'Quote Detail'
  },
  {
    exact: true,
    path: '/tickets/:idTicket/Messages',
    breadcrumb: 'Messages',
    component: Messages,
    title: 'Messages'
  },
  {
    exact: true,
    path: '/tickets/:idTicket/Messages/:idMessage',
    breadcrumb: 'Message Detail',
    component: MessageDetail,
    title: 'Message Detail'
  },
  {
    exact: true,
    path: '/notifications',
    breadcrumb: 'Notifications',
    component: Notifications,
    title: 'Notifications'
  }
]

const PUBLIC_ROUTES = [
  {
    exact: true,
    path: '/',
    component: Login,
    title: 'Login'
  },
  {
    exact: true,
    path: '/forgot-password',
    component: ForgotPassword,
    title: 'Forgot Password'
  },
  {
    exact: true,
    path: '/reset-password',
    component: ResetPassword,
    title: 'Reset Password'
  },
  {
    exact: true,
    path: '/verify-email',
    component: VerifyEmail,
    title: 'Verify Email'
  }
]

export { PUBLIC_ROUTES, PRIVATE_ROUTES }
