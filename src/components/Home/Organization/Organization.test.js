import React from 'react';
import ReactDOM from 'react-dom';
import Organization from './index'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Organization organization={{ users: [] }}/>, div);
  ReactDOM.unmountComponentAtNode(div);
});
