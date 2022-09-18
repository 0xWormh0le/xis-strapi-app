import { Button, Menu, MenuButton, MenuItem, MenuList, BoxProps } from '@chakra-ui/core'
import * as React from 'react'

type DropdownItem = { title: string; onClick?: () => void }

type DropdownMenuProps = BoxProps & {
  menuItems: DropdownItem[]
  title: string
}
const DropdownMenu: React.FC<DropdownMenuProps> = ({ menuItems, title, ...rest }) => {
  return (
    <Menu>
      {({ isOpen }) => (
        <React.Fragment>
          {/* 
          // @ts-ignore - complains about rightIcon prop, but it exists */}
          <MenuButton as={Button} rightIcon={isOpen ? 'chevron-up' : 'chevron-down'} {...rest}>
            {title}
          </MenuButton>
          <MenuList>
            {menuItems.map(({ title, onClick }) => (
              <MenuItem key={title} onClick={onClick}>
                {title}
              </MenuItem>
            ))}
          </MenuList>
        </React.Fragment>
      )}
    </Menu>
  )
}

export default DropdownMenu
