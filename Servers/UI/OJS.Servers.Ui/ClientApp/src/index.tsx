import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import Loading from './components/guidelines/loading/Loading';
import register from './registerServiceWorker';

const container = document.getElementById('root');
const root = createRoot(container!);

root
    .render(<Suspense fallback={<Loading isWholePage isLoading/>}>
        <App/>
    </Suspense>);


register();
