/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
import React from 'react';
import { useLocation } from 'react-router';
import { Box } from '@mui/material';

import ProblemForm from './problemForm/ProblemForm';

const AdministrationProblem = () => {
    const { pathname } = useLocation();
    const [ , , , problemId ] = pathname.split('/');

    return (
        <Box>
            <ProblemForm problemId={Number(problemId)} isEditMode />
        </Box>
    );
};

export default AdministrationProblem;
