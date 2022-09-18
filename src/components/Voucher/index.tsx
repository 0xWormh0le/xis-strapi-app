import styled from '@emotion/styled'
import React from 'react'
import { Flex, Box } from '@chakra-ui/core'
import { theme } from '../../theme'
import { H3, H4, Text } from '../Typography'
import moment from 'moment'
import { DATE_FORMAT } from '../../constants'

const { white } = theme.colors.solid

type Props = {
  total?: number
  code?: string
  validUntil?: moment.Moment | string
}

type StyleProps = {
  side?: 'left' | 'right'
}

const Notch = styled.div<StyleProps>`
  border-bottom-${({ side }: StyleProps) => side}-radius: 70px;
  border-top-${({ side }: StyleProps) => side}-radius: 70px;
  width: 40px;
  height: 80px;
  background-color: ${white};
  position: absolute;
  bottom: 150px;
  left: ${({ side }: StyleProps) => (side === 'left' ? '381px' : '121px')};
`

const Divider = styled.div`
  border: 1px dashed #fff;
  width 90%;
  margin-top: 20px;
`

const Voucher: React.FC<Props> = ({ ...rest }) => {
  return (
    <Box
      borderRadius={10}
      mx="auto"
      my={8}
      maxWidth={300}
      maxHeight={450}
      bg="brand.900"
      width="100%"
    >
      <Flex alignItems="center" flexDirection="column" my={4} textAlign="center">
        <H4 p={6} fontWeight="bold" color={white}>
          Voucher Redeemed
        </H4>
        <Text color={white}>
          You have redeemed a voucher worth a grand total of <b>R{rest.total}</b> to spend on all
          Babor products.
        </Text>
        <Divider />
      </Flex>
      <Flex alignItems="center" flexDirection="column" my={6}>
        <Text textAlign="center" color={white} my={4}>
          Voucher Code
        </Text>
        <H3 fontWeight="bold" color={white} mb={8}>
          {rest.code}
        </H3>
        <Text color={white} mt={8}>
          Valid Until - {rest.validUntil}
        </Text>
      </Flex>
      <Box display="inline-block" width="100%">
        <Notch side="right" />
        <Notch side="left" />
      </Box>
    </Box>
  )
}

export default Voucher

Voucher.defaultProps = {
  total: 14600.0,
  code: 'BAB878907',
  validUntil: moment().format(DATE_FORMAT)
}
