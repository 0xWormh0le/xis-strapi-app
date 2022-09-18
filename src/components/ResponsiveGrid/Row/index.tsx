import css from '@emotion/css'
import styled from '@emotion/styled'
import * as React from 'react'
import { Row, RowProps } from 'react-flexbox-grid'
import { color, ColorProps, space, SpaceProps } from 'styled-system'
import { theme } from '../../../theme'

export type StyledRowProps = RowProps &
  SpaceProps &
  ColorProps & {
    color?: string
  }

const StyledRow = styled(Row)`
  ${space};
  ${color};
  ${() => {
    if (theme.gridGutter) {
      return css`
        margin-left: -${theme.gridGutter / 2}rem;
        margin-right: -${theme.gridGutter / 2}rem;
      `
    } else {
      return css`
        margin-left: 1rem;
        margin-right: 1rem;
      `
    }
  }}
`

const CustomRow: React.FC<StyledRowProps> = ({ children, ...rest }) => {
  return <StyledRow {...rest}>{children}</StyledRow>
}

export default CustomRow
