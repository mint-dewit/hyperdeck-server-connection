
# Hyperdeck server connection

[![CircleCI](https://circleci.com/gh/baltedewit/hyperdeck-server-connection.svg?style=svg)](https://circleci.com/gh/baltedewit/hyperdeck-server-connection)

## Technology highlights
- Typescript
- Yarn
- Jest
- standard-version
- codecov

## Installation

<!-- For usage by library consumers installation is as easy as:
```sh
yarn add hyperdeck-server-connection
``` -->

For library developers installation steps are as following:
```sh
git clone https://github.com/nrkno/tv-automation-hyperdeck-connection
yarn
yarn build
```

If you want to make a contribution, feel free to open a PR.

## Usage

```javascript
const { HyperdeckServer } = require('../dist/server')
const myHyperdeck = new Hyperdeck()

const s = new HyperdeckServer()
s.onPlay = cmd => {
    console.log('playing', cmd)
    status.status = 'play'
    s.notifyTransport({
        ...status,
        speed: '100',
        'slot id': '1',
        'clip id': '1',
        'single clip': 'true',
        'video format': '1080i50',
        loop: false
    })
    return Promise.resolve()
}
```

### Events


## Test

This module will run tests by jest. (TBD)
```sh
$ yarn unit
```