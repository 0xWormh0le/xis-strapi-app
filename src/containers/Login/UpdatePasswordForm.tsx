import { Button, Flex } from '@chakra-ui/core'
import { Field, Form, Formik, FormikActions, FormikProps } from 'formik'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import * as Yup from 'yup'
import { CardFooter, ConnectedPasswordInput } from '../../components'
import { Text } from '../../components/Typography'
import { PASSWORD_REGEX, PASSWORD_REGEX_MESSAGE } from '../../constants'

const INITIAL_VALUES = {
  password: '',
  confirmPassword: ''
}

type SetPasswordFormValues = typeof INITIAL_VALUES

type UpdatePasswordFormProps = RouteComponentProps & {
  cognitoUserObject: any
  onClose?: () => void
}

const SetPasswordFormValidation = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Password has to be longer than 6 characters!')
    .matches(PASSWORD_REGEX, { message: PASSWORD_REGEX_MESSAGE })
    .required('A password is required'),
  confirmPassword: Yup.string()
    .required('Confirm your password')
    .oneOf([Yup.ref('password')], 'Password does not match')
})

const UpdatePasswordForm: React.FC<UpdatePasswordFormProps> = ({
  cognitoUserObject,
  history,
  onClose
}) => {
  const handleSetPassword = async (
    { password }: SetPasswordFormValues,
    { setSubmitting, setStatus }: FormikActions<SetPasswordFormValues>
  ) => {
    setSubmitting(true)
    try {
      setStatus('')
      setSubmitting(true)
      // await Auth.completeNewPassword(cognitoUserObject, password, {})
      history.push('/dashboard')
    } catch (err) {
      setStatus(err.message)
      setSubmitting(false)
    }
  }

  return (
    <React.Fragment>
      <Flex flexDirection="column">
        <Formik
          initialValues={INITIAL_VALUES}
          validationSchema={SetPasswordFormValidation}
          onSubmit={(values, actions) => handleSetPassword(values, actions)}
          render={({ handleSubmit, status, isSubmitting }: FormikProps<SetPasswordFormValues>) => {
            return (
              <Form>
                <Flex flexDirection="column" p={4}>
                  <Text mb={4}>
                    Because you are signing in for the first time, you need to set yourself a new
                    password.
                  </Text>
                  <Field
                    name="password"
                    type="password"
                    label="New Password"
                    component={ConnectedPasswordInput}
                  />
                  <Field
                    name="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    component={ConnectedPasswordInput}
                  />
                  {!!status && (
                    <Text
                      textAlign="center"
                      fontSize="md"
                      color="red.500"
                      fontWeight="lighter"
                      mb={2}
                    >
                      {status}
                    </Text>
                  )}
                </Flex>
                <CardFooter flexDirection="row" justifyContent="flex-end" flex={1}>
                  <Button mr={4} variant="outline" type="submit" onClick={onClose}>
                    CANCEL
                  </Button>
                  <Button
                    isLoading={isSubmitting}
                    type="submit"
                    variantColor="primary"
                    onClick={() => handleSubmit()}
                  >
                    SUBMIT
                  </Button>
                </CardFooter>
              </Form>
            )
          }}
        />
      </Flex>
    </React.Fragment>
  )
}

export default withRouter(UpdatePasswordForm)
