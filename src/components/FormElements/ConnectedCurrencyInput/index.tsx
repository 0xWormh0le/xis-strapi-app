import {
  Flex,
  InputGroup,
  InputLeftAddon,
  NumberInput,
  NumberInputField,
  NumberInputProps
} from '@chakra-ui/core'
import { ErrorMessage, FieldProps } from 'formik'
import * as React from 'react'
import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import { Text } from '../../Typography'
import { Label, LabelProps } from '../styles'

type ConnectedCurrencyInputProps = LabelProps &
  FieldProps &
  NumberInputProps & {
    label?: string
    unit: string
    precision?: number
  }

const numberMask = createNumberMask({
  prefix: '',
  includeThousandsSeparator: false,
  allowDecimal: true
})

const ConnectedCurrencyInput: React.FC<ConnectedCurrencyInputProps> = ({
  label,
  field,
  placeholder,
  unit,
  precision,
  ...rest
}) => (
  <Flex flexDirection="column" width="100%" mr={rest.mr} ml={rest.ml} mt={rest.mt} mb={rest.mb}>
    {label && <Label htmlFor={field.name}>{label}</Label>}
    <InputGroup width="100%">
      {!!unit && <InputLeftAddon>{unit}</InputLeftAddon>}
      <NumberInput precision={precision} step={0.01} width="100%">
        <NumberInputField
          {...field}
          id={field.name}
          as={MaskedInput}
          // @ts-ignore
          showMask={false}
          // @ts-ignore
          guide={false}
          // @ts-ignore
          mask={numberMask}
          roundedLeft={!!unit ? 0 : 4}
          focusBorderColor="brand.500"
          placeholder={placeholder || label}
        />
      </NumberInput>
    </InputGroup>
    <ErrorMessage name={field.name}>
      {(msg) => {
        return (
          <Text mt={2} color="error.500" textAlign="right">
            {msg}
          </Text>
        )
      }}
    </ErrorMessage>
  </Flex>
)

export default ConnectedCurrencyInput

ConnectedCurrencyInput.defaultProps = {
  mb: 2,
  fontWeight: 'lighter',
  precision: 0
}
