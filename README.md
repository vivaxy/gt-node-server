## Initialize

- Install nodejs
- Install [gt](https://github.com/vivaxy/granturismo)

    `sudo npm install -g granturismo`

- Add scaffold into gt `gt config add vivaxy/gt-node-server https://github.com/vivaxy/gt-node-server.git`
- Create your project directory `mkdir my-project-name && cd my-project-name` or `git clone ...`
- Run `gt init`
- Select `vivaxy/gt-node-server`

## Contribute

Feel free to submit any issue.

Steps to make contributions

- Update codes
- Submit your changes by [`gacp`](https://github.com/vivaxy/gacp)
- Run `npm run release` to update `CHANGELOG.md` and bump version
- Run [`gacp`](https://github.com/vivaxy/gacp) to push changes into origin

----------

# gt-node-server

A node server

## Feature

- log4js as logger
- pm2 process manage
- Support in nodejs > v6.10.0, npm > 5

## Develop

- `npm run dev`
- Open in browser `http://127.0.0.1:8080`

## Guides

### Actions

```js
exports.argTypes = {
  name: ArgTypes.string.isRequired,
  age: ArgTypes.number
};
exports.defaultArgs = {
  age: 18
};
exports.get = function get({ args, httpStatusCodes }) {
  return {
    status: httpStatusCodes.OK,
    body: args,
  }
};
exports.post = function post({ args, httpStatusCodes }) {
  return {
    status: httpStatusCodes.OK,
    body: args,
  }
}
```

## Render React

SSR: `http://127.0.0.1:8080/demo/render-react?ssr=1`
CSR: `http://127.0.0.1:8080/demo/render-react`

## Deploy

- `npm start`
- `curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d 'id=3' "http://127.0.0.1:8080/demo/1?id=2"`
`> {"code":0,"data":{"body":{"id":"3"},"query":{"id":"2"},"params":{"id":"1"},"args":{"id":"3"}}}`
