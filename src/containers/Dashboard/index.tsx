import { Button, StatLabel, StatNumber } from '@chakra-ui/core'
import React from 'react'
import { RefreshCcw } from 'react-feather'
import { RouteComponentProps } from 'react-router'
import { GridGenerator, StatsCard } from '../../components'
import { PageWrap } from '../../layouts'

const Dashboard: React.FC<RouteComponentProps> = () => {
  return (
    <PageWrap flexDirection="column">
      <GridGenerator cols={4}>
        <StatsCard
          title="Total Sales"
          footer={
            <StatLabel>
              Daily Average <b>R100</b>
            </StatLabel>
          }
        >
          <StatNumber fontSize="4xl">{`R ${100}`}</StatNumber>
        </StatsCard>
        <StatsCard
          title="Total Sales Spas"
          footer={
            <StatLabel>
              Daily Average <b>R 100</b>
            </StatLabel>
          }
        >
          <StatNumber fontSize="4xl">{`R ${100}`}</StatNumber>
        </StatsCard>
        <StatsCard
          title="Total Sales Salons"
          footer={
            <StatLabel>
              Daily Average <b>R 100</b>
            </StatLabel>
          }
        >
          <StatNumber fontSize="4xl">{`R ${100}`}</StatNumber>
        </StatsCard>
        <StatsCard title="Points Redemption Rate">
          <StatNumber fontSize="4xl">100%</StatNumber>
        </StatsCard>
      </GridGenerator>
      <Button
        right={4}
        bottom={4}
        width="auto"
        variant="solid"
        position="fixed"
        leftIcon={RefreshCcw}
        variantColor="primary"
        // onClick={() => refetch()}
      >
        Refresh
      </Button>
    </PageWrap>
  )
}

export default Dashboard
