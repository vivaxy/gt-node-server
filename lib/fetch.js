/**
 * @since 20171226 18:41
 * @author vivaxy
 */
const fetch = require('isomorphic-fetch');

const getFetchURL = ({ req, path }) => {
  if (req) {
    return 'https://' + req.headers.host + path;
  }
  return path;
};

module.exports = async ({ req, path }) => {
  const response = await fetch(getFetchURL({ req, path }));
  return await response.json();
};
