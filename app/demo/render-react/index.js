/**
 * @since 2019-11-25 11:38
 * @author vivaxy
 */
import React from 'react';
import { Provider } from 'react-redux';
import HTTP_METHODS from '../../../configs/http_methods';

import store from './store';
import Fetch from './Fetch';
import Button from './Button';
import * as actions from './actions';

export default (
  <Provider store={store}>
    <div>
      <Button />
      <Fetch />
    </div>
  </Provider>
);

export const getState = store.getState;

export async function initialize(ctx) {
  const data = await ctx.fetch({
    path: '/demo/render-react-id',
    method: HTTP_METHODS.POST,
    data: {
      seq: 42,
    },
  });
  store.dispatch(actions.setFetchedData(data.data.args));
}
