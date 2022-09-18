import styled from '@emotion/styled'
import * as React from 'react'
import {
  alignItems,
  color,
  flex,
  flexDirection,
  flexWrap,
  height,
  justifyContent,
  maxHeight,
  space,
  width
} from 'styled-system'
import { AppContext } from '../contexts/ApplicationProvider.context'
import { StyledSystemProps } from '../typings/StyledSystemProps'

type Props = StyledSystemProps & {
  color?: string
  backgroundImage?: string
}

const StyledPageWrap = styled.div`
  ${flex};
  ${space};
  ${color};
  ${width};
  ${height};
  ${flexWrap};
  ${maxHeight};
  ${alignItems};
  ${flexDirection};
  ${justifyContent};
  display: flex;
  box-sizing: border-box;
  background-size: cover;
  background-image: url(${(props: Props) => props.backgroundImage});
`

const PageWrap: React.FC<Props> = ({ children, ...rest }) => {
  const { drawerOpen, toggleDrawer } = React.useContext(AppContext)

  React.useEffect(() => {
    if (drawerOpen) {
      toggleDrawer()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <StyledPageWrap {...rest}>{children}</StyledPageWrap>
}

PageWrap.defaultProps = {
  pb: 4,
  flex: 1,
  bg: 'gray.50',
  flexDirection: 'row',
  pt: 'calc(60px + 1rem)',
  justifyContent: 'flex-start'
}

export default PageWrap
