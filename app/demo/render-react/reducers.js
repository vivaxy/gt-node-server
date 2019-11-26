/**
 * @since 2019-11-25 08:13
 * @author vivaxy
 */
import * as ACTION_TYPES from './actions';

export default function(state, action) {
  switch (action.type) {
    case ACTION_TYPES.CLICK:
      return {
        ...state,
        text: 'Clicked!',
      };
    case ACTION_TYPES.RESET:
      return {
        ...state,
        text: 'Click me!',
      };
    case ACTION_TYPES.FETCH_START:
      return {
        ...state,
        fetchLoading: true,
      };
    case ACTION_TYPES.FETCH_SUCCESS:
      return {
        ...state,
        fetchLoading: false,
        fetchedData: action.payload,
      };
    case ACTION_TYPES.FETCH_ERROR:
      return {
        ...state,
        fetchLoading: false,
        fetchedData: null,
      };
    default:
      return state;
  }
}
