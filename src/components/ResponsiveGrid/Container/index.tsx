import css from '@emotion/css'
import styled from '@emotion/styled'
import * as React from 'react'
import { Grid, GridProps } from 'react-flexbox-grid'
import { color, ColorProps, space, SpaceProps } from 'styled-system'
import { theme } from '../../../theme'

export type StyledContainerProps = GridProps &
  SpaceProps &
  ColorProps & {
    color?: string
  }

const StyledContainer = styled(Grid)`
  ${space};
  ${color};
  ${() => {
    if (theme.gridGutter) {
      return css`
        padding-left: ${theme.gridGutter}rem;
        padding-right: ${theme.gridGutter}rem;
      `
    } else {
      return css`
        padding-left: 1rem;
        padding-right: 1rem;
      `
    }
  }}
`

const CustomContainer: React.FC<StyledContainerProps> = ({ children, ...rest }) => {
  return (
    <StyledContainer style={{ width: '100%' }} {...rest}>
      {children}
    </StyledContainer>
  )
}

export default CustomContainer
