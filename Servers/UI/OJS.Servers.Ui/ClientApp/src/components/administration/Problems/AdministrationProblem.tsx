/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { useLocation } from 'react-router';
import { Box, Slide, Tab, Tabs } from '@mui/material';

import { TESTS } from '../../../common/labels';

import ProblemForm from './problemForm/ProblemForm';
import TestsInProblemView from './tests-in-problem-view/TestsInProblemView';

enum ProblemsListData {
    Tests = 'tests',
}

const AdministrationProblem = () => {
    const { pathname } = useLocation();
    const [ , , , problemId ] = pathname.split('/');
    const [ tabName, setTabName ] = useState(ProblemsListData.Tests);

    const onTabChange = (event: React.SyntheticEvent, newValue: ProblemsListData) => {
        setTabName(newValue);
    };

    return (
        <Slide direction="left" in mountOnEnter unmountOnExit timeout={300}>
            <Box>
                <ProblemForm problemId={Number(problemId)} isEditMode contestId={null} />
                <Box sx={{ padding: '2rem' }}>
                    <Tabs
                      sx={{ minWidth: '100%', display: 'flex', justifyContent: 'space-around' }}
                      value={tabName}
                      onChange={onTabChange}
                      aria-label="wrapped label tabs example"
                    >
                        <Tab
                          sx={{ minWidth: '45%', display: 'flex', justifyContent: 'space-evenly' }}
                          value="tests"
                          label={TESTS}
                          wrapped
                        />
                    </Tabs>
                    {tabName === 'tests' &&
                        <TestsInProblemView problemId={Number(problemId)} />}
                </Box>
            </Box>
        </Slide>
    );
};

export default AdministrationProblem;
