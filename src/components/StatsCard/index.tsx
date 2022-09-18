import { Flex, Icon, Stat, StatLabel, Tooltip } from '@chakra-ui/core'
import React from 'react'
import { Card, CardFooter, CardHeader } from '..'

type StatsCardProps = {
  title: string
  help?: string
  footer?: React.ReactNode
}

const StatsCard: React.FC<StatsCardProps> = (props) => (
  <Card mb={4}>
    <CardHeader>
      <Stat pr={0}>
        <Flex justifyContent="space-between">
          <StatLabel mb={2}>{props.title}</StatLabel>
          <Tooltip
            hasArrow
            aria-label={props.help || props.title}
            label={props.help || props.title}
            placement="bottom"
          >
            <Icon name="info-outline" />
          </Tooltip>
        </Flex>
        {props.children}
      </Stat>
    </CardHeader>
    {props.footer && <CardFooter>{props.footer}</CardFooter>}
  </Card>
)

export default StatsCard
