import React from 'react';
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
