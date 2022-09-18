import styled from '@emotion/styled'
import { color, ColorProps, space, SpaceProps } from 'styled-system'

export const ImageContainer = styled.img`
  display: block;
  max-width: 100%;
  position: relative;
  height: ${(props) => props.height || 'auto'};
`

export const Wrapper = styled.div<SpaceProps>`
  ${space};
  display: flex;
  overflow: hidden;
  flex-flow: column;
  position: relative;
  box-sizing: border-box;
  border-bottom-width: 1px;
  &:hover .image-overlay {
    bottom: 0;
    opacity: 1;
    pointer-events: all;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
`

type PlaceholderProps = ColorProps & {
  color?: string
  width?: string | number
  height?: string | number
}

export const Placeholder = styled.div<PlaceholderProps>`
  ${color};
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => props.width || '100%'};
  height: ${(props) => props.height || '300px'};
`
export const HiddenInput = styled.input`
  opacity: 0;
  z-index: -1;
  width: 0.1px;
  height: 0.1px;
  overflow: hidden;
  position: absolute;
`
