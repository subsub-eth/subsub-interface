import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as TestUtils from 'react-dom/test-utils';
import { AppContent } from '../src/components/App';


it('App is rendered', () => {
  const div = document.createElement('div');
  TestUtils.act(() => {
      ReactDOM.render(<AppContent />, div);
    });

  // Verify text content
  expect(div.textContent).toEqual('Hello World!agagagag');
});
