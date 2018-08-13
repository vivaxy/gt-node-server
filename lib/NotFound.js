/**
 * @since 20180212 16:03
 * @author vivaxy
 */

import httpStatusCodes from '../conf/httpStatusCodes';
import Action from './Action';

export default class NotFound extends Action {
  execute() {
    this.setStatusAndBodyByStatusCode(httpStatusCodes.NOT_FOUND);
  }
}
