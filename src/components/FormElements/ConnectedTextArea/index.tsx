import { Flex, Textarea, Text } from '@chakra-ui/core'
import { InputProps } from '@chakra-ui/core/dist/Input'
import { ErrorMessage, FieldProps } from 'formik'
import * as React from 'react'
import { Label, LabelProps } from '../styles'

export type ConnectedFormGroupProps = LabelProps &
  FieldProps &
  InputProps & {
    label?: string
  }

const ConnectedTextArea: React.FC<ConnectedFormGroupProps> = ({
  type,
  label,
  field,
  placeholder,
  ...rest
}) => (
  <Flex flexDirection="column" width="100%" mr={rest.mr} ml={rest.ml} mt={rest.mt} mb={rest.mb}>
    {label && (
      <Label color="solid.lightGray" htmlFor={field.name}>
        {label}
      </Label>
    )}
    <Textarea
      {...field}
      type={type}
      id={field.name}
      focusBorderColor="brand.500"
      placeholder={placeholder || label}
      {...rest}
    />
    <ErrorMessage name={field.name}>
      {(msg) => (
        <Text color="error.500" textAlign="right">
          {msg}
        </Text>
      )}
    </ErrorMessage>
  </Flex>
)

export default ConnectedTextArea

ConnectedTextArea.defaultProps = {
  mb: 2,
  type: 'text',
  fontWeight: 'lighter'
}
