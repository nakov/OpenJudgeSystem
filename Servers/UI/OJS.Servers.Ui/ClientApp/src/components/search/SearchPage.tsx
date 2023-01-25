import React from 'react';
import { useLocation } from 'react-router-dom';

import { setLayout } from '../../pages/shared/set-layout';

const SearchPage = () => {
    const { state } = useLocation();
    console.log(state);
    return (
        <>
            <h2>Test</h2>
            <h1>{state.toString()}</h1>
        </>
    );
};
export default setLayout(SearchPage, true);
