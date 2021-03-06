/**
 * @since 2019-11-25 07:53
 * @author vivaxy
 */
import { createStore } from 'redux';
import reducers from './reducers';

const initialState = {
  text: 'Click me!',
  fetchLoading: true,
  fetchedData: null,
};

const store = createStore(
  reducers,
  typeof window !== 'undefined' ? window.__state || initialState : initialState,
  (typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__()) ||
    undefined
);

export default store;
