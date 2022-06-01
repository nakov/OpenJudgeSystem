import React, { Suspense } from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import register from './registerServiceWorker';
import Loading from './components/guidelines/loading/Loading';

render(
    <Suspense fallback={<Loading isWholePage isLoading />}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Suspense>,
    document.getElementById('root'),
);

register();
