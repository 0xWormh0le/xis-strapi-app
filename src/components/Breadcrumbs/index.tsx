import { Flex } from '@chakra-ui/core'
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import withBreadcrumbs, { BreadcrumbsProps } from 'react-router-breadcrumbs-hoc'
import { Link } from 'react-router-dom'
import { PRIVATE_ROUTES } from '../../navigation/routes'
import { H5 } from '../Typography'

const Breadcrumbs: React.FC<RouteComponentProps & { breadcrumbs: BreadcrumbsProps<{}>[] }> = ({
  breadcrumbs
}) => {
  return (
    <Flex flexDirection="row">
      {breadcrumbs.map(({ breadcrumb, match }, index) => {
        const ml = index === 0 ? 0 : 2
        return (
          <React.Fragment key={match.url}>
            <Link to={match.url || ''}>
              <H5 ml={ml} mr={2} mb={0}>
                {breadcrumb}
              </H5>
            </Link>
            {index < breadcrumbs.length - 1 && '  >  '}
          </React.Fragment>
        )
      })}
    </Flex>
  )
}

export default withBreadcrumbs<{}>(PRIVATE_ROUTES, { disableDefaults: true })(Breadcrumbs)
