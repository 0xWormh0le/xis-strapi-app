import { Field, getIn } from 'formik'
import * as React from 'react'
import { SpaceProps } from 'styled-system'
import { Text } from '../../Typography'

type Props = SpaceProps & {
  name: string
  requireTouched?: boolean
}

const ArrayErrorMessage: React.FC<Props> = ({ name, requireTouched = false, ...rest }) => (
  <Field
    name={name}
    render={({ form }: { form: any }) => {
      const error = getIn(form.errors, name)
      const touch = getIn(form.touched, name)
      if (requireTouched) {
        return touch && error ? (
          <Text color="error" {...rest}>
            {error}
          </Text>
        ) : null
      }
      return error ? (
        <Text color="error" {...rest}>
          {error}
        </Text>
      ) : null
    }}
  />
)

export default ArrayErrorMessage
