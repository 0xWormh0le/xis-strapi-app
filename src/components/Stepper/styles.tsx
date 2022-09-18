import styled from '@emotion/styled'
import { color, ColorProps, width, WidthProps } from 'styled-system'

type SpacerLineProps = ColorProps & WidthProps

export const SpacerLine = styled<'div', SpacerLineProps>('div')`
  ${color};
  ${width};
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
`

export const Square = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
`

export const OuterCircle = styled<'div', ColorProps>('div')`
  ${color};
  width: 38px;
  height: 38px;
  display: flex;
  border-radius: 19px;
  align-items: center;
  justify-content: center;
`

export const InnerCircle = styled<'div', ColorProps>('div')`
  ${color};
  width: 36px;
  height: 36px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
`
