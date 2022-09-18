import css from '@emotion/css'
import styled from '@emotion/styled'
import * as React from 'react'
import { Col, ColProps } from 'react-flexbox-grid'
import { color, ColorProps, space, SpaceProps } from 'styled-system'
import { theme } from '../../../theme'

export type StyledColProps = ColProps &
  SpaceProps &
  ColorProps & {
    color?: string
  }

const StyledCol = styled(Col)`
  ${space};
  ${color};
  ${() => {
    if (theme.gridGutter) {
      return css`
        padding-left: ${theme.gridGutter / 2}rem;
        padding-right: ${theme.gridGutter / 2}rem;
      `
    } else {
      return css`
        padding-left: 0.5rem;
        padding-right: 0.5rem;
      `
    }
  }}
`

const CustomCol: React.FC<StyledColProps> = ({ children, ...rest }) => {
  return <StyledCol {...rest}>{children}</StyledCol>
}

export default CustomCol
