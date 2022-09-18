import { Button, Flex, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/core'
import { InputProps } from '@chakra-ui/core/dist/Input'
import { ErrorMessage, FieldProps } from 'formik'
import * as React from 'react'
import { Label, LabelProps } from '../styles'

export type ConnectedFormGroupProps = LabelProps &
  FieldProps &
  InputProps & {
    label?: string
  }

const ConnectedFormGroup: React.FC<ConnectedFormGroupProps> = ({
  type,
  label,
  field,
  placeholder,
  ...rest
}) => {
  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)
  return (
    <Flex flexDirection="column" width="100%" mr={rest.mr} ml={rest.ml} mt={rest.mt} mb={rest.mb}>
      {label && <Label htmlFor={field.name}>{label}</Label>}
      <InputGroup size="md">
        <Input
          {...field}
          id={field.name}
          focusBorderColor="brand.500"
          type={show ? 'text' : 'password'}
          placeholder={placeholder || label}
          {...rest}
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={handleClick}>
            {show ? 'Hide' : 'Show'}
          </Button>
        </InputRightElement>
      </InputGroup>
      <ErrorMessage name={field.name}>
        {(msg) => (
          <Text color="red.500" textAlign="right">
            {msg}
          </Text>
        )}
      </ErrorMessage>
    </Flex>
  )
}

export default ConnectedFormGroup

ConnectedFormGroup.defaultProps = {
  mb: 2,
  type: 'text',
  fontWeight: 'lighter'
}
