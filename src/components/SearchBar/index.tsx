import { Input } from '@chakra-ui/core'
import { BoxProps } from '@chakra-ui/core/dist/Box'
import React from 'react'

export type SearchBarProps = BoxProps & {
  onChange: (e: any) => any
  value: string
  placeholder?: string
  variantText?: any
  width?: string
}

const SearchBar: React.FC<SearchBarProps> = ({
  onChange,
  placeholder,
  value,
  variantText,
  width
}) => {
  return (
    <Input
      onChange={onChange}
      placeholder={placeholder}
      value={value}
      variant={variantText}
      width={width}
    />
  )
}

SearchBar.defaultProps = {
  bg: 'white',
  width: 'auto',
  rounded: 'md',
  borderWidth: '1px',
  variantText: 'outline',
  placeholder: 'Search Ticket'
}

export default SearchBar
