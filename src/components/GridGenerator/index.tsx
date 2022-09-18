import { chunk } from 'lodash'
import * as React from 'react'
import { SpaceProps } from 'styled-system'
import { Col, Container, Row } from '../'

type GridGeneratorProps = SpaceProps & {
  cols: 1 | 2 | 3 | 4 | 6 | 12
}

const GridGenerator: React.FC<GridGeneratorProps> = ({ cols, children, ...rest }) => {
  const colWidth = 12 / cols

  const rows = chunk(React.Children.toArray(children), cols)

  return (
    <Container {...rest}>
      {rows.map((cols, i) => (
        <Row key={i}>
          {cols.map((col, i) => (
            <Col key={i} sm={12} md={colWidth}>
              {col}
            </Col>
          ))}
        </Row>
      ))}
    </Container>
  )
}

export default GridGenerator
