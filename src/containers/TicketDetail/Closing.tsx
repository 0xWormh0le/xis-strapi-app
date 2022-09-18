import React from 'react'
import { Flex, Select } from '@chakra-ui/core'
import { Card } from 'components'
import { Text } from 'components/Typography'
import { ActualFault, Maybe, ResolutionCode, Scalars, SubFault } from 'generated/graphql'

export interface ClosingType {
  actualFault: Maybe<Scalars['ID']> | undefined
  resolutionCode: Maybe<Scalars['ID']> | undefined
  subFault: Maybe<Scalars['ID']> | undefined
}

interface ClosingProps {
  colors: any
  closingInput: Maybe<ClosingType> | undefined
  actualFaults: ActualFault[]
  resolutionCodes: ResolutionCode[]
  subFaults: SubFault[]
  changeClosingInput: (ciInput: Maybe<ClosingType> | undefined) => void
}

const ClosingInfo: React.FC<ClosingProps> = ({
  colors,
  closingInput,
  actualFaults,
  resolutionCodes,
  subFaults,
  changeClosingInput
}) => {
  const handleInputChange = (field: string) => (e: any) =>
    closingInput &&
    changeClosingInput({
      ...closingInput,
      [field]: e.target.value === '' ? null : e.target.value
    })

  return (
    <Card mt={5} p={4}>
      <Text mb={5} fontWeight="bold">
        Closing Information
      </Text>
      <Flex flexDirection={['column', 'row']} justifyContent="flex-start" flexWrap="wrap">
        <Flex flexDirection="column" textAlign="left" mr={[0, 10]}>
          <Text color={colors.solid.lightGray}>Resolution Code</Text>
          <Select
            value={closingInput?.resolutionCode || undefined}
            onChange={handleInputChange('resolutionCode')}
            aria-labelledby="resolution-code"
            placeholder="Resolution code"
          >
            {resolutionCodes.map(({ id, resCode }) => (
              <option value={id} key={id}>
                {resCode}
              </option>
            ))}
          </Select>
        </Flex>

        <Flex flexDirection="column" textAlign="left" mr={[0, 10]}>
          <Text color={colors.solid.lightGray}>Actual Fault</Text>
          <Select
            value={closingInput?.actualFault || undefined}
            onChange={handleInputChange('actulFault')}
            mr={[0, 10]}
            aria-labelledby="actual-fault"
            placeholder="Actual fault"
          >
            {actualFaults.map(({ id, fault }) => (
              <option value={id} key={id}>
                {fault}
              </option>
            ))}
          </Select>
        </Flex>

        <Flex flexDirection="column" textAlign="left">
          <Text color={colors.solid.lightGray}>Sub Fault</Text>
          <Select
            value={closingInput?.subFault || undefined}
            onChange={handleInputChange('subFault')}
            mr={[0, 10]}
            aria-labelledby="sub-fault"
            placeholder="Sub fault"
          >
            {subFaults.map(({ id, subFault }) => (
              <option value={id} key={id}>
                {subFault}
              </option>
            ))}
          </Select>
        </Flex>
      </Flex>
    </Card>
  )
}

export default ClosingInfo
