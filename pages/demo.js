/**
 * @since 2019-05-25 03:49
 * @author vivaxy
 */
module.exports = async function render(args) {
  function sleep(timeout) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  }
  await sleep(1000);
  return `<html><body><pre>${JSON.stringify(args)}</pre></body></html>`;
};
