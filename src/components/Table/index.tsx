import { Flex, Text } from '@chakra-ui/core'
import React from 'react'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp
} from 'react-feather'
import { useMediaQuery } from 'react-responsive'
import { Column, Row, SortingRule, usePagination, useSortBy, useTable } from 'react-table'
import Card from '../Card'
import BottomSection from '../Card/CardFooter'
import TopSection from '../Card/CardHeader/index'
import { StyledTable, TableCell, TableHead, TableIconButton, TableRow } from './styles'

// Use declaration merging to extend types https://github.com/tannerlinsley/react-table/commit/7ab63858391ebb2ff621fa71411157df19d916ba
declare module 'react-table' {
  export interface TableOptions<D extends object>
    extends UsePaginationOptions<D>,
      UseFiltersOptions<D> {}

  export interface TableInstance<D extends object = {}> extends UsePaginationInstanceProps<D> {}

  export interface TableState<D extends object = {}>
    extends UsePaginationState<D>,
      UseSortByState<D> {}

  export interface ColumnInstance<D extends object = {}> extends UseSortByColumnProps<D> {}
}

type TableProps<D extends object = {}> = {
  data: any
  pageSize?: number
  tableHeading?: React.ReactNode
  columns: Column<D>[]
  onRowClick?: (row: Row<D>) => void
  sortBy?: SortingRule<D>[]
}

const Table = <D extends {}>({
  columns,
  data,
  tableHeading,
  pageSize: initialPageSize,
  onRowClick,
  sortBy
}: TableProps<D>) => {
  const tableColumns = React.useMemo(() => columns, [columns])

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 40em)' })

  const {
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable<D>(
    {
      columns: tableColumns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: initialPageSize,
        sortBy: sortBy || [{ id: 'createdAt', desc: true }]
      }
    },
    useSortBy,
    usePagination
  )

  return (
    <Card flexDirection="column" flex={1} maxWidth="100%" width="100%">
      {!!tableHeading && (
        <TopSection flexDirection="row" justifyContent="space-between">
          {tableHeading}
        </TopSection>
      )}
      <StyledTable {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <Flex
              key={headerGroup.id}
              flex={1}
              flexDirection="row"
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column) => (
                <TableCell
                  p={4}
                  key={column.id}
                  bg="gray.100"
                  {...column.getHeaderProps()}
                  justifyContent="space-between"
                  {...column.getSortByToggleProps()}
                >
                  <Text fontWeight="bold">{column.render('Header')}</Text>
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <ChevronDown size={20} />
                    ) : (
                      <ChevronUp size={20} />
                    )
                  ) : (
                    ''
                  )}
                </TableCell>
              ))}
            </Flex>
          ))}
        </TableHead>
        <Flex flexDirection="column">
          {page.map(
            (row, key) =>
              // @ts-ignore
              prepareRow(row) || (
                <TableRow
                  onClick={() => onRowClick && onRowClick(row)}
                  key={key}
                  flexDirection="row"
                  {...row.getRowProps()}
                  data-testid="table-row"
                >
                  {row.cells.map((cell) => {
                    return (
                      <TableCell
                        key={cell.row.index}
                        justifyContent="flex-start"
                        p={4}
                        {...cell.getCellProps()}
                      >
                        {cell.render('Cell')}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
          )}
        </Flex>
      </StyledTable>
      <BottomSection justifyContent="space-between" flexDirection="row">
        <Flex flexDirection="row">
          <TableIconButton
            mr={2}
            onClick={() => gotoPage(0)}
            isDisabled={!canPreviousPage}
            icon={() => <ChevronsLeft size={20} />}
          />
          <TableIconButton
            mr={2}
            isDisabled={!canPreviousPage}
            onClick={() => previousPage()}
            icon={() => <ChevronLeft size={20} />}
          />
        </Flex>
        <Flex justifyContent="center" alignItems="center">
          <Text mr={4}>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </Text>
          {!isTabletOrMobile && (
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
              }}
            >
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          )}
        </Flex>
        <Flex flexDirection="row">
          <TableIconButton
            ml={2}
            isDisabled={!canNextPage}
            onClick={() => nextPage()}
            icon={() => <ChevronRight size={20} />}
          />
          <TableIconButton
            ml={2}
            onClick={() => gotoPage(pageCount ? pageCount - 1 : 1)}
            isDisabled={!canNextPage}
            icon={() => <ChevronsRight size={20} />}
          />
        </Flex>
      </BottomSection>
    </Card>
  )
}

export default Table

Table.defaultProps = {
  pageSize: 10
}
