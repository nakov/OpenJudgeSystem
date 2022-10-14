/* eslint-disable import/no-unused-modules */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';

import Loading from './components/guidelines/loading/Loading';
import App from './App';
import register from './registerServiceWorker';

const container = document.getElementById('root');
const root = createRoot(container!);

root
    .render(<Suspense fallback={<Loading isWholePage isLoading/>}>
        <App/>
    </Suspense>);


register();
