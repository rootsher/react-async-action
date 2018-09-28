import React from 'react';
import Async from 'react-async-action';

const fetchProductToken = () => fetch('api/product/token');
const fetchProductDetails = ({ token }) => fetch('api/product/1/details', { token });

/* NOT WORKING YET */
export default () => (
    <Async action={fetchProductToken}>
        {({ response: token }) => (
            <Async action={fetchProductDetails} token={token}>
                {({ response }) => (
                    response && <pre>{JSON.stringify(response, null, '\t')}</pre>
                )}
            </Async>
        )}
    </Async>
);
