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

* using simple callback children:

```js
import Async from 'react-async-action';

export default () => (
    <Async action={() => fetch('api/product/list')}>
        {({ isLoading, response, error }) => (
            <React.Fragment>
                {isLoading && <div>Loading...</div>}
                {response && <pre>{JSON.stringify(response, null, '\t')}</pre>}
                {error && <pre>{JSON.stringify(error, null, '\t')}</pre>}
            </React.Fragment>
        )}
    </Async>
);
```

* identical example, using only `<Async.X>`:

```js
import Async from 'react-async-action';

export default () => (
    <Async action={() => fetch('api/product/list')}>
        <Async.Loading>
            <div>Loading...</div>
        </Async.Loading>
        <Async.Resolved>
            {response => <pre>{JSON.stringify(response, null, '\t')}</pre>}
        </Async.Resolved>
        <Async.Rejected>
            {error => <pre>{JSON.stringify(error, null, '\t')}</pre>}
        </Async.Rejected>
    </Async>
);

```

### request-on-demand example

```js
import Async from 'react-async-action';

export default () => (
    <Async action={() => fetch('api/product/1/save')} onDemand>
        {({ run, response }) => (
            <React.Fragment>
                <button onClick={run}>save</button>
                {response && <pre>{JSON.stringify(response, null, '\t')}</pre>}
            </React.Fragment>
        )}
    </Async>
);
```

### create-instance example (Async factory)

```js
import { createInstance } from 'react-async-action';

const ProductList = createInstance({
    action: () => fetch('api/product/list'),
});

export default () => (
    <ProductList>
        {({ response }) => (
            <React.Fragment>
                {response && <pre>{JSON.stringify(response, null, '\t')}</pre>}
            </React.Fragment>
        )}
    </ProductList>
);

```

### dependent-requests example

```js
import Async from 'react-async-action';

const fetchProductToken = () => fetch('api/product/token');
const fetchProductDetails = ({ token }) => fetch('api/product/1/details', { token });

export default () => (
    <Async action={fetchProductToken}>
        <Async.Resolved>
            {token => (
                <Async action={fetchProductDetails} token={token}>
                    <Async.Resolved>
                        {response => (
                            <pre>{JSON.stringify(response, null, '\t')}</pre>
                        )}
                    </Async.Resolved>
                </Async>
            )}
        </Async.Resolved>
    </Async>
);
```

### response-transformer example

```js
import Async from 'react-async-action';

export default () => (
    <Async
        action={() => fetch('api/product/list')}
        transformer={response => ({
            ...response,
            someKey: 'someValue'
        })}
    >
        <Async.Resolved>
            {response => <pre>{response.someKey}</pre>}
        </Async.Resolved>
    </Async>
);
```

## API - `<Async>`

### component - available properties (props):

* `action` - a function that should return an asynchronous value
* `transformer` - a function that transform response
* `onResolve` - a function that fires when the promise is fulfilled
* `onReject` - a function that fires when the promise is rejected
* `delay` (ms) - delay in the execution of action
* `onDemand` (boolean) - a flag which allows to run the action on demand

### render component - available properties (props):

* `isPending` - returns true if the request has not yet been fired (boolean)
* `isLoading` - contains status of the asynchronous action (boolean)
* `response` - contains the response of the asynchronous action
* `error` - contains an error that occurred in an asynchronous action
* `run` - function which allows firing action on demand (onDemand flag is required)
* `reload` - a function that allows calling the action again

## `<Async.X> components`

Sub-components are rendering only when the status occured.
These components can be inserted at any level of the structure,
because for communication with the main Async component is used react context api.
Unlike child-functional functions, they allow the capture of responses from Async-parents.

* `<Async.Pending>` - renders itself only when pending status occurs
* `<Async.Loading>` - renders itself only when the loading status occurs
* `<Async.Resolved>` - render only when resolved status occurs
* `<Async.Rejected>` - renders itself only if the status is rejected
