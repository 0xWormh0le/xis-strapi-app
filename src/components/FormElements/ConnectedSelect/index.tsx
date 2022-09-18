import { Flex, FlexProps } from '@chakra-ui/core'
import styled from '@emotion/styled'
import { ErrorMessage, FieldProps } from 'formik'
import * as React from 'react'
import Select from 'react-select'
import { get } from 'styled-system'
import { Text } from '../../Typography'
import { Label, LabelProps } from '../styles'

type SelectObject = { label: string; value: string | boolean }

type ConnectedFormSelectProps = LabelProps &
  FieldProps &
  FlexProps & {
    options: SelectObject[]
    name: string
    label?: string
    color?: string
    placeholder?: string
    disabled?: boolean
    isMulti?: boolean
    isLoading?: boolean
    onSelect?: (value: any) => void
  }

export const StyledSelect = styled(Select)`
  & .react-select__control {
    min-height: 40px;
  }
  & .react-select__menu .react-select__menu-list .react-select__option--is-selected {
    background-color: ${get('colors.primary.500', '#EEE')};
  }
  & .react-select__control--is-focused {
    border: solid 2px ${get('colors.primary.500', '#EEE')};
    box-shadow: none;
  }
  & .react-select__control:hover {
    border: solid 2px ${get('colors.primary.500', '#EEE')};
    box-shadow: none;
  }
`

const ConnectedFormSelect: React.FC<ConnectedFormSelectProps> = ({
  field,
  label,
  disabled,
  options,
  isMulti,
  form,
  isLoading,
  onSelect,
  ...rest
}) => {
  return (
    <Flex {...rest}>
      <Label htmlFor={field.name}>{label}</Label>
      <StyledSelect
        classNamePrefix="react-select"
        isDisabled={disabled}
        name={field.name}
        options={options}
        isMulti={isMulti}
        isLoading={isLoading}
        onBlur={field.onBlur}
        onChange={(option: SelectObject) => {
          form.setFieldValue(field.name, option)
          if (onSelect) {
            onSelect(option.value)
          }
        }}
        value={field.value}
      />
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
}

export default ConnectedFormSelect

ConnectedFormSelect.defaultProps = {
  options: [],
  mb: 4,
  flex: 1,
  minWidth: '150px',
  flexDirection: 'column'
}
