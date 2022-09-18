import { Flex, Text } from '@chakra-ui/core'
import { InputProps } from '@chakra-ui/core/dist/Input'
import { ErrorMessage, FieldProps } from 'formik'
import * as React from 'react'
import { Label, LabelProps } from '../styles'
import { Table } from '../..'

export type ConnectedTableProps = LabelProps &
  FieldProps &
  InputProps & {
    label?: string
    columns: any
    data: any
    tileView: (document: any) => void
    checker: boolean
  }

const ConnectedTable: React.FC<ConnectedTableProps> = ({
  label,
  field,
  columns,
  data,
  checker,
  tileView,
  ...rest
}) => (
  <Flex
    flexDirection="row"
    flexWrap="wrap"
    width="100%"
    mr={rest.mr}
    ml={rest.ml}
    mt={rest.mt}
    mb={rest.mb}
  >
    {label && <Label htmlFor={field.name}>{label}</Label>}
    {data && data.length > 0 ? (
      checker ? (
        <Table columns={columns} onRowClick={() => null} data={data || []} />
      ) : (
        data.map((item: any) => {
          return tileView(item)
        })
      )
    ) : (
      <Flex justifyContent="center">
        <Text>Upload files to quote</Text>
      </Flex>
    )}

    <ErrorMessage name={field.name}>
      {(msg) => (
        <Text color="error.500" textAlign="right">
          {msg}
        </Text>
      )}
    </ErrorMessage>
  </Flex>
)

export default ConnectedTable

ConnectedTable.defaultProps = {
  mb: 2,
  type: 'text',
  fontWeight: 'lighter'
}
