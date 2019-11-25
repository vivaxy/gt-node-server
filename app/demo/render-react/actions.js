/**
 * @since 2019-11-25 07:51
 * @author vivaxy
 */
export const CLICK = 'CLICK';
export const RESET = 'RESET';

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
