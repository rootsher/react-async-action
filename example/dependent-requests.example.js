import React from 'react';
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
