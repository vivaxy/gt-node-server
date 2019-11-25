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
    default:
      return state;
  }
}
