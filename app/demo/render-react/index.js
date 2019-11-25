/**
 * @since 2019-11-25 11:38
 * @author vivaxy
 */
import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import Button from './Button';

export default (
  <Provider store={store}>
    <Button />
  </Provider>
);

export { store };
