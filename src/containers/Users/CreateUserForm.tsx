import { Button, Flex, useToast } from '@chakra-ui/core'
import { Field, Form, Formik, FormikActions, FormikProps } from 'formik'
import * as React from 'react'
import * as Yup from 'yup'
import { CardFooter, ConnectedFormGroup } from '../../components'
import { Text } from '../../components/Typography'
import { SUCCESS_TOAST } from '../../constants'
import { useCreateUserMutation } from '../../generated/graphql'
import { formatGqlError } from '../../utils'

const INITIAL_VALUES = {
  username: '',
  email: ''
}

type CreateUserFormValues = typeof INITIAL_VALUES

type CreateUserFormProps = {
  onClose?: () => void
  refetch?: any
}

const CreateUserValidation = Yup.object().shape({
  name: Yup.string().required('Required'),
  location: Yup.string().required('Required'),
  type: Yup.string().required('Required')
})

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onClose, refetch }) => {
  const [createUser] = useCreateUserMutation()

  const toast = useToast()

  const handleCreateUser = async (
    { username, email }: CreateUserFormValues,
    { setSubmitting, setStatus }: FormikActions<CreateUserFormValues>
  ) => {
    setSubmitting(true)
    try {
      setStatus('')
      setSubmitting(true)
      await createUser({
        variables: { input: { username, email } }
      })
      toast({
        description: `${username} successfully created.`,
        ...SUCCESS_TOAST
      })
      refetch && refetch()
      onClose && onClose()
    } catch (err) {
      setStatus(formatGqlError(err))
      setSubmitting(false)
    }
  }

  return (
    <React.Fragment>
      <Flex flexDirection="column">
        <Formik
          initialValues={INITIAL_VALUES}
          validationSchema={CreateUserValidation}
          enableReinitialize
          onSubmit={handleCreateUser}
          render={({ handleSubmit, status, isSubmitting }: FormikProps<CreateUserFormValues>) => {
            return (
              <Form>
                <Flex flexDirection="column" p={4}>
                  <Field name="name" label="Name" component={ConnectedFormGroup} />
                  <Field name="location" label="Location" component={ConnectedFormGroup} />
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

export default CreateUserForm
