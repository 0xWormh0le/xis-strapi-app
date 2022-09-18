import React, { ChangeEvent } from 'react'
import { Flex, Input, Button, Box } from '@chakra-ui/core'
import { Card } from 'components'
import { Text } from 'components/Typography'
import DatePicker from 'react-datepicker'
import { Maybe, VendorInformation } from 'generated/graphql'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'

interface VendorProps {
  colors: any
  vendor: Maybe<VendorInformation> | undefined
  vendorInput: Maybe<VendorInformation> | undefined
  changeVendorInput: (vendorInput: Maybe<VendorInformation> | undefined) => void
}

const str2date = (s: string) => (s ? moment(s).toDate() : null)

const Vendor: React.FC<VendorProps> = ({ colors, vendorInput, vendor, changeVendorInput }) => {
  const handleChange = (field: string) => (e: any) => {
    let value = null
    if (field === 'vendorRef') {
      value = (e as ChangeEvent<HTMLInputElement>).target.value
    } else if (e) {
      value = e.toISOString()
    }
    vendorInput && changeVendorInput({ ...vendorInput, [field]: value })
  }

  const handleRemoveVendorClick = () => changeVendorInput(null)

  const onAddVendorClick = () =>
    changeVendorInput(
      vendor ||
        ({
          vendorRef: '',
          dispatchDate: null,
          expectedArrival: null,
          actualArrival: null
        } as VendorInformation)
    )

  return (
    <Card mt={5} p={4}>
      <Text mb={5} fontWeight="bold">
        Vendor Information
      </Text>
      {vendorInput ? (
        <Flex flexDirection={['column', 'row']} justifyContent="flex-start" flexWrap="wrap">
          <Flex flexDirection="column" textAlign="left">
            <Text color={colors.solid.lightGray}>Vendor Ref</Text>
            <Input
              value={vendorInput.vendorRef || ''}
              onChange={handleChange('vendorRef')}
              width={250}
              mr={[0, 10]}
            />
          </Flex>
          <Flex flexDirection="column" textAlign="left" mt={[2, 0]}>
            <Text color={colors.solid.lightGray}>Dispatch Date</Text>
            <DatePicker
              selected={str2date(vendorInput.dispatchDate)}
              onChange={handleChange('dispatchDate')}
              dateFormat="MM/dd/yyyy h:mm aa"
              showTimeInput
              customInput={<Input width={250} mr={[0, 10]} />}
            />
          </Flex>
          <Flex flexDirection="column" textAlign="left" mt={[2, 0]}>
            <Text color={colors.solid.lightGray}>Expected Arrival</Text>
            <DatePicker
              selected={str2date(vendorInput.expectedArrival)}
              onChange={handleChange('expectedArrival')}
              dateFormat="MM/dd/yyyy h:mm aa"
              showTimeInput
              customInput={<Input width={250} mr={[0, 10]} />}
            />
          </Flex>
          <Flex flexDirection="column" textAlign="left" mt={[2, 0]}>
            <Text color={colors.solid.lightGray}>Actual Arrival</Text>
            <DatePicker
              selected={str2date(vendorInput.actualArrival)}
              onChange={handleChange('actualArrival')}
              dateFormat="MM/dd/yyyy h:mm aa"
              showTimeInput
              customInput={<Input width={250} />}
            />
          </Flex>
        </Flex>
      ) : (
        <Text color={colors.solid.lightGray}>No vendor</Text>
      )}

      <Box>
        <Button
          size="sm"
          width={['100%', 150]}
          bg="#717273"
          color={colors.solid.white}
          title={vendorInput ? 'Remove Vendor' : 'Add Vendor'}
          float={['unset', 'right']}
          onClick={vendorInput ? handleRemoveVendorClick : onAddVendorClick}
          mt={4}
        >
          {vendorInput ? 'Remove Vendor' : 'Add Vendor'}
        </Button>
      </Box>
    </Card>
  )
}

export default Vendor
