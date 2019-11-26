/**
 * @since 2019-11-25 04:25
 * @author vivaxy
 */
import ReactDOM from 'react-dom';
import querystring from 'querystring';

import HTTP_METHODS from '../../configs/http_methods';
import app, { initialize } from '../../app/demo/render-react';

if (window.__state) {
  ReactDOM.hydrate(app, document.getElementById('__render-react-root'));
} else {
  ReactDOM.render(app, document.getElementById('__render-react-root'));
  const ctx = {
    async fetch({ path, method, data, headers }) {
      let body = null;
      if (method === HTTP_METHODS.GET || method === HTTP_METHODS.HEAD) {
        path += `?${querystring.stringify(data)}`;
        body = null;
      } else {
        body = new FormData();
        Object.keys(data).forEach(function(key) {
          body.append(key, data[key]);
        });
      }
      const resp = await fetch(path, {
        method,
        body,
        headers,
      });
      return await resp.json();
    },
  };
  initialize(ctx);
}
