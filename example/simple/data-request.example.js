import React from 'react';
import Async from 'react-async-action';

export default () => (
    <Async action={() => fetch('api/product/list')}>
        {({ isLoading, response, error }) => (
            <React.Fragment>
                {isLoading && <div>Loading...</div>}
                {response && <pre>{JSON.stringify(response, null, '\t')}</pre>}
                {error && <div style={{ color: 'red' }}>{JSON.stringify(error, null, '\t')}</div>}
            </React.Fragment>
        )}
    </Async>
);
