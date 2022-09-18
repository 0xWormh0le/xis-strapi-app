import { Button, Flex, Image } from '@chakra-ui/core'
import { Field, Form, Formik, FormikActions, FormikProps } from 'formik'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'
import { SideSlider } from '../../components'
import ConnectedFormGroup from '../../components/FormElements/ConnectedFormGroup'
import { H3, Text } from '../../components/Typography'
import { PageWrap } from '../../layouts'
import images from '../../theme/images'
import { getPackageVersionNumber } from '../../utils'

const VerifyEmailFormValidation = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('An email address is required')
})

const VerifyEmail: React.FC<RouteComponentProps> = ({ history }) => {
  const INITIAL_VALUES = {
    email: history.location.state ? history.location.state.email : '',
    code: ''
  }

  type VerifyEmailFormValues = typeof INITIAL_VALUES

  const handleVerifyEmail = async (
    { email, code }: VerifyEmailFormValues,
    { setSubmitting, setError }: FormikActions<VerifyEmailFormValues>
  ) => {
    setSubmitting(true)
    try {
      // await Auth.confirmSignUp(email, code)
      setSubmitting(false)
      history.push('/', { email })
    } catch (err) {
      console.log(err)
      setSubmitting(false)
      setError(err.message)
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
          <H3 color="brand.500">Email Verification</H3>
          <Formik
            initialValues={INITIAL_VALUES}
            validationSchema={VerifyEmailFormValidation}
            onSubmit={(values, actions) => handleVerifyEmail(values, actions)}
            render={({ handleSubmit, isSubmitting, error }: FormikProps<VerifyEmailFormValues>) => {
              return (
                <Form>
                  <Field name="email" label="Email" component={ConnectedFormGroup} />
                  <Field name="code" label="Verification Code" component={ConnectedFormGroup} />
                  {!!error && (
                    <Text textAlign="center" fontSize="md" color="red.500" mb={2}>
                      {error}
                    </Text>
                  )}
                  <Button
                    mt={2}
                    isLoading={isSubmitting}
                    isFullWidth
                    type="submit"
                    variantColor="brand"
                    onClick={() => handleSubmit()}
                  >
                    SUBMIT
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
            <Text fontSize="md" fontWeight="lighter" mt={2}>
              Already have an account?
              <Text fontWeight="bold" fontSize="md" color="brand.500">
                <Link to="/"> Login.</Link>
              </Text>
            </Text>
            <Text textAlign="center" fontSize="md" mt={2} data-testid="versionNumber">
              {getPackageVersionNumber()}
            </Text>
          </Flex>
        </Flex>
        <Flex px={3} bg="brand" borderRadius="0 4px 4px 0" display={['none', 'flex']}>
          <Flex width="100%" height="100%" alignItems="center" justifyContent="center">
            <Image width="75%" src={images.logoBlack} />
          </Flex>
        </Flex>
      </SideSlider>
    </PageWrap>
  )
}

export default VerifyEmail
