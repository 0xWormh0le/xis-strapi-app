import { Button, Flex, Heading, Image, useToast } from '@chakra-ui/core'
import { Field, Form, Formik, FormikActions, FormikProps } from 'formik'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import * as Yup from 'yup'
import { ConnectedPasswordInput } from '../../components'
import ConnectedFormGroup from '../../components/FormElements/ConnectedFormGroup'
import SideSlider from '../../components/SideSlider/index'
import { Text } from '../../components/Typography'
import { PASSWORD_REGEX, PASSWORD_REGEX_MESSAGE, SUCCESS_TOAST } from '../../constants'
import { PageWrap } from '../../layouts'
import images from '../../theme/images'

const ResetPasswordFormValidation = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('An email address is required'),
  code: Yup.string().required('Required'),
  newPassword: Yup.string()
    .min(6, 'Password has to be longer than 6 characters!')
    .matches(PASSWORD_REGEX, { message: PASSWORD_REGEX_MESSAGE })
    .required('A password is required'),
  confirmPassword: Yup.string()
    .required('Confirm your password')
    .oneOf([Yup.ref('newPassword')], 'Password does not match')
})

const ResetPassword: React.FC<RouteComponentProps> = ({ history }) => {
  const INITIAL_VALUES = {
    email: history.location.state ? history.location.state.email : '',
    code: '',
    newPassword: ''
  }

  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const toast = useToast()

  type ResetPasswordFormValues = typeof INITIAL_VALUES

  const handleResetPassword = async (
    { email, code, newPassword }: ResetPasswordFormValues,
    { setSubmitting }: FormikActions<ResetPasswordFormValues>
  ) => {
    setSubmitting(true)
    try {
      setError('')
      setLoading(true)
      // await Auth.forgotPasswordSubmit(email, code, newPassword)
      history.push('/', { email })
      toast({
        description: 'Password reset successfully!',
        ...SUCCESS_TOAST
      })
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <PageWrap
      height="100vh"
      alignItems="center"
      justifyContent="center"
      backgroundImage={images.landingBackground}
    >
      <SideSlider>
        <Flex width="100%" p={6} flexDirection="column">
          <Image src={images.logoBlack} width="40%" height="auto" maxWidth="100%" mb={4} />
          <Heading size="lg" mb={2} color="brand" fontWeight="light">
            Reset Password
          </Heading>
          <Formik
            initialValues={INITIAL_VALUES}
            validationSchema={ResetPasswordFormValidation}
            onSubmit={(values, actions) => handleResetPassword(values, actions)}
            render={({ handleSubmit }: FormikProps<ResetPasswordFormValues>) => {
              return (
                <Form>
                  <Field name="email" label="Email" component={ConnectedFormGroup} />
                  <Field name="code" label="Verification Code" component={ConnectedFormGroup} />
                  <Field
                    name="newPassword"
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
                  {!!error && (
                    <Text
                      textAlign="center"
                      fontSize="md"
                      color="red.500"
                      fontWeight="lighter"
                      mb={2}
                    >
                      {error}
                    </Text>
                  )}
                  <Button
                    mt={2}
                    isFullWidth
                    variantColor="brand"
                    isLoading={loading}
                    type="submit"
                    onClick={() => handleSubmit()}
                  >
                    RESET
                  </Button>
                </Form>
              )
            }}
          />
        </Flex>
      </SideSlider>
    </PageWrap>
  )
}

export default ResetPassword
