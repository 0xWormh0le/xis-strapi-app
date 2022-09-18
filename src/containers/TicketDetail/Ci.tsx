import React, { ChangeEvent } from 'react'
import { Flex, Input, Button, Box } from '@chakra-ui/core'
import { Card } from 'components'
import { Text } from 'components/Typography'
import { Maybe, CiInformation } from 'generated/graphql'

interface CiProps {
  colors: any
  ci: Maybe<CiInformation> | undefined
  ciInput: Maybe<CiInformation> | undefined
  changeCiInput: (ciInput: Maybe<CiInformation> | undefined) => void
}

const Ci: React.FC<CiProps> = ({ colors, ciInput, ci, changeCiInput }) => {
  const handleChange = (field: string) => (value: ChangeEvent<HTMLInputElement>) =>
    ciInput && changeCiInput({ ...ciInput, [field]: value.target.value })

  const handleRemoveCiClick = () => changeCiInput(null)

  const onAddCiClick = () =>
    changeCiInput(
      ci ||
        ({
          ciName: '',
          serialNum: '',
          ciLocation: ''
        } as CiInformation)
    )

  return (
    <Card mt={5} p={4}>
      <Text mb={5} fontWeight="bold">
        CI Information
      </Text>
      {ciInput ? (
        <Flex flexDirection={['column', 'row']} justifyContent="flex-start" flexWrap="wrap">
          <Flex flexDirection="column" textAlign="left">
            <Text color={colors.solid.lightGray}>CI Name</Text>
            <Input
              value={ciInput.ciName || ''}
              onChange={handleChange('ciName')}
              width={250}
              mr={[0, 10]}
            />
          </Flex>

          <Flex flexDirection="column" textAlign="left">
            <Text color={colors.solid.lightGray}>Serial Num</Text>
            <Input
              value={ciInput.serialNum || ''}
              onChange={handleChange('serialNum')}
              width={250}
              mr={[0, 10]}
            />
          </Flex>

          <Flex flexDirection="column" textAlign="left">
            <Text color={colors.solid.lightGray}>CI Location</Text>
            <Input
              value={ciInput.ciLocation || ''}
              onChange={handleChange('ciLocation')}
              width={250}
              mr={[0, 10]}
            />
          </Flex>
        </Flex>
      ) : (
        <Text color={colors.solid.lightGray}>No CI</Text>
      )}

      <Box>
        <Button
          size="sm"
          width={['100%', 150]}
          bg="#717273"
          color={colors.solid.white}
          title={ciInput ? 'Remove CI' : 'Add CI'}
          float={['unset', 'right']}
          onClick={ciInput ? handleRemoveCiClick : onAddCiClick}
          mt={4}
        >
          {ciInput ? 'Remove CI' : 'Add CI'}
        </Button>
      </Box>
    </Card>
  )
}

export default Ci
