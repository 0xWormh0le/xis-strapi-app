import styled from '@emotion/styled'
import { TextTransformProperty } from 'csstype'
import { color, fontSize, fontWeight, letterSpacing, space, textAlign, width } from 'styled-system'
import { StyledSystemProps } from '../../typings/StyledSystemProps'

type Props = StyledSystemProps & {
  pointer?: boolean
  textTransform?: TextTransformProperty
  color?: string
}

const P = styled.p<Props>`
  ${space};
  ${color};
  ${width};
  ${fontSize};
  ${textAlign};
  ${fontWeight};
  ${letterSpacing};
  text-transform: ${(props: Props) => props.textTransform || 'none'};
  &:hover {
    cursor: ${(props: Props) => (props.pointer ? 'pointer' : 'default')};
  }
`

export default P

P.defaultProps = {
  fontSize: 'md'
}
