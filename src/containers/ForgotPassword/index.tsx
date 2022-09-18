import { Button, Flex, Image } from '@chakra-ui/core'
import { Field, Form, Formik, FormikActions, FormikProps } from 'formik'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'
import ConnectedFormGroup from '../../components/FormElements/ConnectedFormGroup'
import SideSlider from '../../components/SideSlider/index'
import { H3, Text } from '../../components/Typography'
import { PageWrap } from '../../layouts'
import images from '../../theme/images'
import { getPackageVersionNumber } from '../../utils'

const INITIAL_VALUES = {
  email: ''
}

type ForgotPasswordFormValues = typeof INITIAL_VALUES

const ForgotPasswordFormValidation = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('An email address is required')
})

const ForgotPassword: React.FC<RouteComponentProps> = ({ history }) => {
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleForgotPassword = async (
    { email }: ForgotPasswordFormValues,
    { setSubmitting }: FormikActions<ForgotPasswordFormValues>
  ) => {
    setSubmitting(true)
    try {
      setError('')
      setLoading(true)
      // await Auth.forgotPassword(email)
      history.push('/reset-password', { email })
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
        <Flex width="100%" p={8} flexDirection="column">
          <Image
            src={images.logoBlack}
            width="100%"
            height="auto"
            maxWidth="100%"
            mb={4}
            marginBottom={50}
          />
          <H3 color="brand.700">Forgot Password</H3>
          <Formik
            initialValues={INITIAL_VALUES}
            validationSchema={ForgotPasswordFormValidation}
            onSubmit={(values, actions) => handleForgotPassword(values, actions)}
            render={({ handleSubmit }: FormikProps<ForgotPasswordFormValues>) => {
              return (
                <Form>
                  <Field type="email" name="email" label="Email" component={ConnectedFormGroup} />
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
                    isLoading={loading}
                    variantColor="brand"
                    type="submit"
                    onClick={() => handleSubmit()}
                  >
                    NEXT
                  </Button>
                </Form>
              )
            }}
          />
          <Flex
            mt={2}
            width="100%"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Text fontWeight="bold" color="brand.700" fontSize="md" mt={2} textAlign="center">
              <Link to="/forgot-password">Forgot Password</Link>
            </Text>
            <Text
              fontSize="md"
              textAlign="center"
              color="text.muted"
              mt={2}
              data-testid="versionNumber"
            >
              {getPackageVersionNumber()}
            </Text>
          </Flex>
        </Flex>
      </SideSlider>
    </PageWrap>
  )
}

export default ForgotPassword
