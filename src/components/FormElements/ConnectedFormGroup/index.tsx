import { Flex, Input, Text, InputLeftElement, InputGroup } from '@chakra-ui/core'
import { InputProps } from '@chakra-ui/core/dist/Input'
import { ErrorMessage, FieldProps } from 'formik'
import * as React from 'react'
import { Label, LabelProps } from '../styles'

export type ConnectedFormGroupProps = LabelProps &
  FieldProps &
  InputProps & {
    label?: string
    showLeftElement?: boolean
  }

const ConnectedFormGroup: React.FC<ConnectedFormGroupProps> = ({
  type,
  label,
  field,
  placeholder,
  showLeftElement,
  ...rest
}) => (
  <Flex flexDirection="column" width="100%" mr={rest.mr} ml={rest.ml} mt={rest.mt} mb={rest.mb}>
    {label && <Label htmlFor={field.name}>{label}</Label>}
    {showLeftElement ? (
      <InputGroup>
        <Input
          pl={10}
          {...field}
          type={type}
          id={field.name}
          focusBorderColor="brand.500"
          placeholder={placeholder || label}
          {...rest}
        />

        <InputLeftElement color="gray.300" fontSize="1.2em">
          R
        </InputLeftElement>
      </InputGroup>
    ) : (
      <Input
        {...field}
        type={type}
        id={field.name}
        focusBorderColor="brand.500"
        placeholder={placeholder || label}
        {...rest}
      />
    )}

    <ErrorMessage name={field.name}>
      {(msg) => (
        <Text color="error.500" textAlign="right">
          {msg}
        </Text>
      )}
    </ErrorMessage>
  </Flex>
)

export default ConnectedFormGroup

ConnectedFormGroup.defaultProps = {
  mb: 2,
  type: 'text',
  fontWeight: 'lighter'
}
