/*
 *
 * LeftMenu
 *
 */

import React from 'react';
import { withRouter } from 'react-router-dom';
import LeftMenuHeader from '../../components/LeftMenuHeader';
import LeftMenuLinkContainer from '../../components/LeftMenuLinkContainer';
import Wrapper from './Wrapper';

function LeftMenu(props) {
  return (
    <Wrapper>
      <LeftMenuHeader key="header" {...props} />
      <LeftMenuLinkContainer {...props} />
    </Wrapper>
  );
}

export default withRouter(LeftMenu);
