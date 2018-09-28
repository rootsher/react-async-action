# react-async-action - `<Async>`

[![npm version](https://img.shields.io/npm/v/react-async-action.svg)](https://www.npmjs.com/package/react-async-action)
[![npm downloads](https://img.shields.io/npm/dm/react-async-action.svg)](https://www.npmjs.com/package/react-async-action)
[![GitHub issues](https://img.shields.io/github/issues/rootsher/react-async-action.svg)](https://github.com/ghengeveld/react-async/issues)
[![GitHub PRs](https://img.shields.io/github/issues-pr/rootsher/react-async-action.svg)](https://github.com/ghengeveld/react-async/pulls)
[![ISC license](https://img.shields.io/npm/l/react-async.svg)](https://opensource.org/licenses/ISC)

## installation

```bash
npm install --save react-async-action
```

## usage

### data-request example

```js
import { Async } from 'react-async-action';

export default () => (
    <Async action={() => fetch('api/product/list')}>
        {({ isLoading, response, error }) => (
            <div>
                {isLoading && <div>Loading...</div>}
                {response && <pre>{JSON.stringify(response, null, '\t')}</pre>}
                {error && <div style={{ color: 'red' }}>{JSON.stringify(error, null, '\t')}</div>}
            </div>
        )}
    </Async>
);
```

## `<Async>` component - available properties (props):

* `action` - a function that should return an asynchronous value

## `<Async>` render component - available properties (props):

* `isLoading` - contains state of the asynchronous action (boolean)
* `response` - contains the response of the asynchronous action
* `error` - contains an error that occurred in an asynchronous action
