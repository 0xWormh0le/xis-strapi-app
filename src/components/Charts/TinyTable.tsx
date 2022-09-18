import React from 'react'
import { Table } from '../../components'

const columns = [
  {
    Header: 'Rank',
    Cell: ({ row }: any) => {
      return <div>{row.index + 1}</div>
    }
  },
  {
    Header: 'Name',
    accessor: 'user.name'
  },
  {
    Header: 'Total',
    accessor: 'total'
  }
]

type TinyTableProps = {
  data: any
}

const TinyTable: React.FC<TinyTableProps> = ({ data }) => {
  return <Table sortBy={[{ id: 'total', desc: true }]} pageSize={3} columns={columns} data={data} />
}

export default TinyTable
