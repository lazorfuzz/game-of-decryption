import React from 'react';
import ReactDOM from 'react-dom';
import MemberArea from './index'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MemberArea organizations={[]} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
