/**
 * @since 2019-11-25 07:51
 * @author vivaxy
 */
export const CLICK = 'CLICK';
export const RESET = 'RESET';
export const SET_FETCHED_DATA = 'SET_FETCHED_DATA';

export function click() {
  return {
    type: CLICK,
  };
}

export function reset() {
  return {
    type: RESET,
  };
}

export function setFetchedData(payload) {
  return {
    type: SET_FETCHED_DATA,
    payload,
  };
}
