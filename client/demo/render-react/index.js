/**
 * @since 2019-11-25 04:25
 * @author vivaxy
 */
import React from 'react';
import ReactDOM from 'react-dom';

import App from '../../../app/demo/render-react';

ReactDOM.hydrate(<App />, document.getElementById('_render_react_root_'));
