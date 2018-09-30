import React from 'react';
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
