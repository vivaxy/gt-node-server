## INITIALIZE

- install nodejs
- install [gt](https://github.com/vivaxy/granturismo)

    `sudo npm install -g granturismo`

- add scaffold into gt `gt config add vivaxy/gt-node-server https://github.com/vivaxy/gt-node-server.git`
- create your project directory `mkdir my-project-name && cd my-project-name` or `git clone ...`
- run `gt init`
- select `vivaxy/gt-node-server`

## CONTRIBUTE

Feel free to submit any issue.

Steps to make contributions

- update codes
- submit your changes by [`gacp`](https://github.com/vivaxy/gacp)
- run `npm run release` to update `CHANGELOG.md` and bump version
- run [`gacp`](https://github.com/vivaxy/gacp) to push changes into origin

----------

# gt-node-server

Node server initialized by [vivaxy/gt-node-server](https://github.com/vivaxy/gt-node-server)

## FEATURE

- es6 es7 support
- log4js as logger
- pm2 process manage

## DEVELOP

- `npm start`
- open in browser `http://127.0.0.1:8080`

## DEPLOY

- `npm start`
