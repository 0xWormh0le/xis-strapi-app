import React from 'react'
import { RouteComponentProps } from 'react-router'
import { H1, H4 } from '../../components/Typography'
import { PageWrap } from '../../layouts'

const PageNotFound: React.FC<RouteComponentProps> = (props) => {
  console.log('props', props)
  return (
    <PageWrap>
      <H1>Damn it</H1>
      <H4>The thing you are looking for is not a thing.</H4>
      <H4>Maybe look for another thing?</H4>
    </PageWrap>
  )
}

export default PageNotFound
