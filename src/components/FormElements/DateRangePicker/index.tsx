import { Flex } from '@chakra-ui/core'
import { Moment } from 'moment'
import * as React from 'react'
import { DateRangePicker } from 'react-dates'
import 'react-dates/lib/css/_datepicker.css'
import { useMediaQuery } from 'react-responsive'
import { Label, LabelProps } from '../styles'
import { DatePickerWrapper } from './styles'

type Props = LabelProps & {
  label?: string
  onChange: (startDate: Moment | null, endDate: Moment | null) => void
}

const RangePicker: React.FC<Props> = ({ label, onChange, ...rest }) => {
  const [dateRange, setDateRange] = React.useState<{
    startDate: Moment | null
    endDate: Moment | null
  }>({ startDate: null, endDate: null })
  const [focused, setFocus] = React.useState<'startDate' | 'endDate' | null>(null)

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })

  const handleChange = (startDate: Moment | null, endDate: Moment | null) => {
    setDateRange({ startDate, endDate })
    onChange(startDate, endDate)
  }

  return (
    <Flex
      flexDirection="column"
      width={['100%', 'auto']}
      mr={rest.mr}
      ml={rest.ml}
      mt={rest.mt}
      mb={rest.mb}
    >
      {label && <Label>{label}</Label>}
      <DatePickerWrapper>
        <DateRangePicker
          isOutsideRange={() => false}
          endDateId="end-date-id"
          startDateId="start-date-id"
          endDate={dateRange.endDate}
          startDate={dateRange.startDate}
          orientation={isTabletOrMobile ? 'vertical' : 'horizontal'}
          focusedInput={focused} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
          onFocusChange={(focusedInput) => setFocus(focusedInput)} // PropTypes.func.isRequired,
          onDatesChange={({ startDate, endDate }) => handleChange(startDate, endDate)} // PropTypes.func.isRequired,
        />
      </DatePickerWrapper>
    </Flex>
  )
}

export default RangePicker

RangePicker.defaultProps = {
  fontWeight: 'lighter'
}
