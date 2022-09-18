import styled from '@emotion/styled'
import { Edit, Plus } from 'react-feather'
import { color, ColorProps, space, SpaceProps } from 'styled-system'
import { theme } from '../../theme'

type OverlayProps = SpaceProps & ColorProps

export const Overlay = styled<'label', OverlayProps>('label')`
  ${space};
  ${color};
  right: 0;
  opacity: 0;
  bottom: -60px;
  display: flex;
  position: absolute;
  align-items: center;
  pointer-events: none;
  box-sizing: border-box;
  justify-content: center;
  border-top-left-radius: 4px;
  box-shadow: 0 0px 4px -1px rgba(50, 50, 93, 0.3);
  transition: ${theme.transition};
  &:hover {
    cursor: pointer;
    background-color: white;
    transition: ${theme.transition};
  }
`

export const PlusIcon = styled(Plus)<any>`
  ${color}
  width: 20px;
  height: 20px;
  font-size: 40px;
`

export const EditIcon = styled(Edit)<any>`
  ${color}
  width: 20px;
  height: 20px;
  font-size: 40px;
`
