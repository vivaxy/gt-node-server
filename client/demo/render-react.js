/**
 * @since 2019-11-25 04:25
 * @author vivaxy
 */
import ReactDOM from 'react-dom';

import app from '../../app/demo/render-react';

if (window.__state) {
  ReactDOM.hydrate(app, document.getElementById('__render-react-root'));
} else {
  ReactDOM.render(app, document.getElementById('__render-react-root'));
}
