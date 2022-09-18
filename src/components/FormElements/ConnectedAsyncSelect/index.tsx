import { useQuery } from '@apollo/react-hooks'
import { Flex, FlexProps } from '@chakra-ui/core'
import styled from '@emotion/styled'
import { ErrorMessage, FieldProps } from 'formik'
import { DocumentNode } from 'graphql'
import * as React from 'react'
import Select from 'react-select'
import { get } from 'styled-system'
import { formatGqlError } from '../../../utils/index'
import { Text } from '../../Typography'
import { Label, LabelProps } from '../styles'

type SelectObject = { label: string; value: string | boolean }

type ConnectedAsyncSelectProps = LabelProps &
  FieldProps &
  FlexProps & {
    name: string
    label?: string
    color?: string
    placeholder?: string
    disabled?: boolean
    isMulti?: boolean
    queryDocument: DocumentNode
    accessor: string
    queryArgs?: any
    onSelect?: (value: any) => void
  }

export const StyledSelect = styled(Select)`
  & .react-select__control {
    min-height: 40px;
  }
  & .react-select__menu .react-select__menu-list .react-select__option--is-selected {
    background-color: ${get('colors.primary.500', '#EEE')};
    z-index: 1000;
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

const ConnectedAsyncSelect: React.FC<ConnectedAsyncSelectProps> = ({
  field,
  label,
  disabled,
  queryDocument,
  isMulti,
  accessor,
  form,
  queryArgs,
  onSelect,
  ...rest
}) => {
  const { loading, data, error } = useQuery(queryDocument, { ...queryArgs })
  return (
    <Flex {...rest}>
      <Label htmlFor={field.name}>{label}</Label>
      <StyledSelect
        isLoading={loading}
        classNamePrefix="react-select"
        isDisabled={disabled}
        name={field.name}
        options={
          data &&
          data[accessor] &&
          data[accessor].map((item: any) => ({ value: item, label: item.name }))
        }
        isMulti={isMulti}
        onBlur={field.onBlur}
        onChange={(option: SelectObject) => {
          form.setFieldValue(field.name, option)
          if (onSelect) {
            onSelect(option.value)
          }
        }}
        value={field.value}
      />
      {error && <Text color="error">{formatGqlError(error)}</Text>}
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

export default ConnectedAsyncSelect

ConnectedAsyncSelect.defaultProps = {
  size: 'sm',
  mb: 4,
  flex: 1,
  width: '100%',
  minWidth: '150px',
  flexDirection: 'column'
}
