/**
 * @since 2019-11-25 04:25
 * @author vivaxy
 */
import ReactDOM from 'react-dom';

import app from '../../app/demo/render-react';

if (window._STATE_) {
  ReactDOM.hydrate(app, document.getElementById('_render_react_root_'));
} else {
  ReactDOM.render(app, document.getElementById('_render_react_root_'));
}
