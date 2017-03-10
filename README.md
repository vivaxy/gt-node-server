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
- run `yarn run release` to update `CHANGELOG.md` and bump version
- run [`gacp`](https://github.com/vivaxy/gacp) to push changes into origin

----------

# gt-node-server

node server

## FEATURE

- log4js as logger
- pm2 process manage
- tested in nodejs v7.7.2

## DEVELOP

- `yarn run dev`
- open in browser `http://127.0.0.1:8080`

## DEPLOY

- `yarn start`
- `curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d 'id=3' "http://127.0.0.1:8080/demo/1?id=2"`
`> {"code":0,"data":{"body":{"id":"3"},"query":{"id":"2"},"params":{"id":"1"}}}`
