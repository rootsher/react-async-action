import React from 'react';
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
