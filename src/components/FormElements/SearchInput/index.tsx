import { CircularProgress, Flex, Input } from '@chakra-ui/core'
import { FlexProps } from '@chakra-ui/core/dist/Flex'
import { InputProps } from '@chakra-ui/core/dist/Input'
import * as React from 'react'
import { useDebounce } from '../../../utils/index'
import { Label, LabelProps } from '../styles'

type SearchInputProps = LabelProps &
  InputProps &
  FlexProps & {
    label?: string
    name: string
    placeholder?: string
    isSearching: boolean
    onSearch: (term: string) => void
  }

const SearchInput: React.FC<SearchInputProps> = ({
  name,
  label,
  placeholder,
  onSearch,
  isSearching,
  ...rest
}) => {
  const [searchTerm, setSearchTerm] = React.useState('')

  const debouncedTerm = useDebounce(searchTerm, 500)

  React.useEffect(
    () => {
      onSearch(debouncedTerm)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedTerm] // Only call effect if debounced search term changes
  )

  return (
    <Flex
      mr={rest.mr}
      ml={rest.ml}
      mt={rest.mt}
      mb={rest.mb}
      pos="relative"
      width={['100%', '100%', 'auto']}
      flexDirection="column"
      justifyContent="center"
    >
      {label && <Label htmlFor={name}>{label}</Label>}
      <Input
        id={name}
        focusBorderColor="brand.500"
        placeholder={placeholder || label}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value)}
        {...rest}
      />
      {isSearching && (
        <CircularProgress
          size="16px"
          right="16px"
          isIndeterminate
          position="absolute"
          color="primary.500"
        />
      )}
    </Flex>
  )
}

export default SearchInput
