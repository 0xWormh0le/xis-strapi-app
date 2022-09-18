import moment from 'moment'
import React from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { get } from 'styled-system'
import { theme } from '../../theme'

const focusColor = get(theme.colors, 'blue.500', 'blue')

type SimpleBarChartProps = {
  yearData: any
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ yearData }) => {
  const chartData = yearData
    ? JSON.parse(yearData).map(
        ({ month: monthIndex, sales }: { month: number; sales: number }) => ({
          month: moment(monthIndex + 1, 'M').format('MMM'),
          Sales: sales
        })
      )
    : []
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Sales" fill={focusColor} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default SimpleBarChart
