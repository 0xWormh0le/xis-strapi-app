import { Spinner } from '@chakra-ui/core'
import styled from '@emotion/styled'
import React from 'react'
import { color, ColorProps } from 'styled-system'

export type FillLoaderProps = ColorProps & {
  backgroundImage?: string
  color?: string
}

const Wrapper = styled.div<FillLoaderProps>`
  ${color}
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  background-size: cover;
  background-image: url(${(props: FillLoaderProps) => props.backgroundImage});
`

const Loader: React.FC<FillLoaderProps> = ({ backgroundImage, ...rest }) => {
  return (
    <Wrapper {...rest} backgroundImage={backgroundImage}>
      <Spinner size="lg">
        <span />
      </Spinner>
    </Wrapper>
  )
}

export default Loader
