/**
 * @since 2019-11-25 07:51
 * @author vivaxy
 */
export const CLICK = 'CLICK';
export const RESET = 'RESET';
export const FETCH_START = 'FETCH_START';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const FETCH_ERROR = 'FETCH_ERROR';

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

export function fetchStart() {
  return {
    type: FETCH,
  };
}

export function fetchSuccess(data) {
  return {
    type: FETCH_SUCCESS,
    payload: data,
  };
}

export function fetchError() {
  return {
    type: FETCH_ERROR,
  };
}
