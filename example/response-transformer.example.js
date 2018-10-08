import React from 'react';
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
            {({ response }) => <pre>{response.someKey}</pre>}
        </Async.Resolved>
    </Async>
);
