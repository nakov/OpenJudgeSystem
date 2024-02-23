import React from 'react';
import { useLocation } from 'react-router-dom';

import TestForm from './test-form/TestForm';

const AdministrationTest = () => {
    const { pathname } = useLocation();
    const [ , , , testId ] = pathname.split('/');
    return (
        <TestForm id={Number(testId)} />
    );
};

export default AdministrationTest;
