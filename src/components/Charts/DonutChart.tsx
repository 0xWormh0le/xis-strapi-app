import React, { useState } from 'react'
import { Pie, PieChart, ResponsiveContainer, Sector } from 'recharts'
import { get } from 'styled-system'
import { theme } from '../../theme'

const focusColor = get(theme.colors, 'blue.500', 'blue')

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value
  } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`R ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  )
}

type DonutChartChartProps = {
  vouchersRedeemedTotal?: string | number | null
  cashRedeemedTotal?: string | number | null
}

const DonutChart: React.FC<DonutChartChartProps> = ({
  vouchersRedeemedTotal = 0,
  cashRedeemedTotal = 0
}) => {
  console.log('cashRedeemedTotal', cashRedeemedTotal)
  console.log('vouchersRedeemedTotal', vouchersRedeemedTotal)
  const [activeIndex, setActiveIndex] = useState(0)

  const onPieEnter = (data: any, index: any) => {
    setActiveIndex(index)
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={[
            { name: 'Vouchers Redeemed', value: vouchersRedeemedTotal || 0 },
            { name: 'Cash Redeemed', value: cashRedeemedTotal || 0 }
          ]}
          innerRadius={100}
          outerRadius={120}
          fill={focusColor}
          dataKey="value"
          onMouseEnter={onPieEnter}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
export default DonutChart
