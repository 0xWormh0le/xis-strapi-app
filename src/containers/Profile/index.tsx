import { Button, Flex, useToast } from '@chakra-ui/core'
import { Field, Form, Formik, FormikProps } from 'formik'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import {
  BottomSection,
  Card,
  CardFooter,
  Col,
  ConnectedFormGroup,
  Container,
  GridGenerator,
  ProfilePicture,
  Row,
  TopSection
} from '../../components'
import { H4, H5, Text } from '../../components/Typography'
import { SUCCESS_TOAST } from '../../constants'
import { useAppContext } from '../../contexts/ApplicationProvider.context'
import {
  useGetUserQuery,
  UsersPermissionsUser,
  useUpdateUserMutation
} from '../../generated/graphql'
import { useAuthentication } from '../../hooks'
import { PageWrap } from '../../layouts'
import { initializeValues, tokenStorage } from '../../utils'

type FormValues = UsersPermissionsUser

const Profile: React.FC<RouteComponentProps> = ({ history }) => {
  const { getUser, setAuthenticated } = useAuthentication()
  const { user } = getUser()
  const { refetch } = useGetUserQuery({ variables: { id: user.id } })
  const { userProfile } = useAppContext()
  const [updateUserMutation] = useUpdateUserMutation()
  const toast = useToast()

  const { username } = userProfile ? userProfile : { username: '' }

  const INITIAL_VALUES = {
    id: '',
    created_at: undefined,
    updated_at: undefined,
    phoneNumber: user.phoneNumber,
    username: user.username,
    email: user.email,
    provider: undefined,
    confirmed: undefined,
    blocked: undefined
  }

  const initialValues = userProfile ? initializeValues(userProfile) : INITIAL_VALUES

  const logout = async () => {
    tokenStorage.clear()
    setAuthenticated(false)
    history.push(`/`)
  }

  return (
    <PageWrap>
      <Container fluid={true}>
        <Row>
          <Col sm={12} md={3}>
            <Card mb={4}>
              <ProfilePicture name="profile-picture" />
              {username && (
                <Flex flexDirection="column" p={4}>
                  <H4 mb={0} onClick={() => refetch()} fontWeight="bold">
                    {username}
                  </H4>
                </Flex>
              )}
              <CardFooter>
                <Button variantColor="brand" onClick={logout}>
                  <Text pointer={true}>Logout</Text>
                </Button>
              </CardFooter>
            </Card>
          </Col>
          <Col sm={12} md={9}>
            <Card>
              <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                onSubmit={async (values, { setSubmitting, setError }) => {
                  const { username } = values
                  try {
                    await updateUserMutation({
                      variables: { id: user.id, input: { username } }
                    })
                    refetch()
                    setSubmitting(false)
                    toast({
                      description: 'Your profile has been updated.',
                      ...SUCCESS_TOAST
                    })
                  } catch (error) {
                    setError(error.message)
                    setSubmitting(false)
                  }
                }}
                render={({
                  handleSubmit,
                  error,
                  values,
                  isSubmitting
                }: FormikProps<FormValues>) => {
                  return (
                    <React.Fragment>
                      <Form>
                        <TopSection>
                          <H5 fontWeight="bold">Basic Profile</H5>
                          <Text>Update your basic profile information here.</Text>
                        </TopSection>
                        <Flex flexDirection="column" py={4}>
                          <GridGenerator cols={3}>
                            <Field
                              name="username"
                              label="Username"
                              component={ConnectedFormGroup}
                            />
                            <Field
                              name="email"
                              disabled={true}
                              type="email"
                              label="Email"
                              component={ConnectedFormGroup}
                            />
                            <Field
                              name="password"
                              label="Password"
                              component={ConnectedFormGroup}
                            />
                          </GridGenerator>
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
                        </Flex>
                        <BottomSection flexDirection="row" justifyContent="flex-end">
                          <Button
                            type="submit"
                            variantColor="brand"
                            isLoading={isSubmitting}
                            // TODO: Add submit form validaion
                            onClick={() => handleSubmit()}
                          >
                            UPDATE
                          </Button>
                        </BottomSection>
                      </Form>
                    </React.Fragment>
                  )
                }}
              />
            </Card>
          </Col>
        </Row>
      </Container>
    </PageWrap>
  )
}

export default Profile
