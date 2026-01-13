import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';

test('renders app header logo', () => {
  const { getByAltText } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(getByAltText(/ShareUpTime/i)).toBeInTheDocument();
});
