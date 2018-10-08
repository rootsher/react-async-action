import React, { Fragment } from 'react';
import Async from 'react-async-action';

export default () => (
    <Async action={() => fetch('api/product/list')} delay={3000}>
        {({ cancel, reload }) => (
            <Fragment>
                <button onClick={reload}>reload</button>
                <button onClick={cancel}>cancel</button>
                <Async.Loading>
                    <div>Loading...</div>
                </Async.Loading>
                <Async.Resolved>
                    {({ response }) => <pre>{JSON.stringify(response, null, '\t')}</pre>}
                </Async.Resolved>
            </Fragment>
        )}
    </Async>
);
