import { Button, Flex, Image } from '@chakra-ui/core'
import { Field, Form, Formik, FormikProps } from 'formik'
import get from 'lodash/get'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'
import { ConnectedFormGroup, ConnectedPasswordInput, SideSlider } from '../../components'
import { H3, Text } from '../../components/Typography'
import { PASSWORD_REGEX, PASSWORD_REGEX_MESSAGE } from '../../constants'
import { useAuthentication } from '../../hooks'
import { PageWrap } from '../../layouts'
import images from '../../theme/images'
import { getPackageVersionNumber, tokenStorage } from '../../utils'
import { login } from '../../services/strapi'

const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/

const LoginFormValidation = Yup.object().shape({
  phoneNumber: Yup.string()
    .matches(phoneRegExp, 'Phone number is not valid')
    .required('A Phone Number is required'),
  password: Yup.string()
    .min(6, 'Password has to be longer than 6 characters')
    .matches(PASSWORD_REGEX, { message: PASSWORD_REGEX_MESSAGE })
    .required('A password is required')
})

const Login: React.FC<RouteComponentProps> = ({ history, location }) => {
  const INITIAL_VALUES = {
    phoneNumber: '',
    password: ''
  }

  const { setUser, isAuthenticated, setAuthenticated } = useAuthentication()

  React.useEffect(() => {
    if (isAuthenticated) {
      history.push('/tickets')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fromUrl = get(location, 'state.from.pathname', null)
  console.log('fromUrl', fromUrl)

  type LoginFormValues = typeof INITIAL_VALUES

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
          <H3 color="brand.700">Login</H3>
          <Formik
            initialValues={INITIAL_VALUES}
            validationSchema={LoginFormValidation}
            onSubmit={async ({ phoneNumber, password }, { setStatus, setSubmitting }) => {
              try {
                setSubmitting(true)
                const user = await login(phoneNumber, password)
                console.log('user', user)
                if (user) {
                  setUser(user.user)
                  tokenStorage.set(user)
                  setAuthenticated(true)
                  if (fromUrl) {
                    history.push(fromUrl)
                  } else {
                    history.push('/tickets')
                  }
                  setSubmitting(false)
                }
              } catch (err) {
                setStatus(err.message)
                setSubmitting(false)
              }
            }}
            render={({ handleSubmit, status, isSubmitting }: FormikProps<LoginFormValues>) => {
              return (
                <Form>
                  <Field
                    name="phoneNumber"
                    type="tel"
                    label="Phone Number"
                    component={ConnectedFormGroup}
                  />
                  <Field
                    name="password"
                    type="password"
                    label="Password"
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
                  <Button
                    mt={2}
                    isFullWidth
                    variantColor="brand"
                    isLoading={isSubmitting}
                    type="submit"
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

export default Login
