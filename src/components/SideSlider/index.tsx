import styled from '@emotion/styled'
import * as React from 'react'
import { animated, useSpring } from 'react-spring'

const PanelWrapper = styled(animated.div)`
  top: 0;
  left: 0;
  bottom: 0;
  width: 350px;
  display: flex;
  max-width: 100%;
  position: fixed;
  overflow-y: auto;
  background: white;
  align-items: center;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  box-shadow: 5px 0px 10px -8px rgba(0, 0, 0, 0.4), -12px 0 8px -4px rgba(0, 0, 0, 0.2);
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`

const SideSlider: React.FC = ({ children }) => {
  const style = useSpring({
    to: {
      opacity: 1,
      transform: 'translate3d(0px,0,0)'
    },
    from: {
      opacity: 0,
      transform: 'translate3d(-350px,0,0)'
    }
  })
  return <PanelWrapper style={style}>{children}</PanelWrapper>
}

export default SideSlider
