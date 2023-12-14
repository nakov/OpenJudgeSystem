/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-tabs */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable max-len */
/* eslint-disable react/jsx-one-expression-per-line */

import React, { useEffect, useState } from 'react';
// eslint-disable-next-line no-restricted-imports
import { useLocation } from 'react-router-dom';
// eslint-disable-next-line no-restricted-imports
import { Box, Tab, Tabs } from '@mui/material';

import { ContestEdit } from '../../../components/administration/Contests/ContestEdit/ContestEdit';
import { ProblemsInContestView } from '../../../components/administration/Contests/ContestEdit/problems/problemsInContestView/ProblemsInContestView';

import styles from './AdministrationContestPage.module.scss';
// eslint-disable-next-line import/prefer-default-export
export const AdministrationContestPage = () => {
    const { pathname } = useLocation();
    // this would be best to be set in redux state on button press in the mai grid, keeping this only for demonstariton
    // eslint-disable-next-line prefer-destructuring
    const contestId = pathname.split('/')[pathname.split('/').length - 1];
    const [ tabName, setTabName ] = useState('problems');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabName(newValue);
    };

    return (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
            <ContestEdit contestId={Number(contestId)} />
            <Box className={styles.paged}>
                <Tabs
                  sx={{ minWidth: '100%', display: 'flex', justifyContent: 'space-around' }}
                  value={tabName}
                  onChange={onTabChange}
                  aria-label="wrapped label tabs example"
                >
                    <Tab
                      sx={{ minWidth: '45%', display: 'flex', justifyContent: 'space-evenly' }}
                      value="problems"
                      label="Problems"
                      wrapped
                    />
                    <Tab sx={{ minWidth: '45%', display: 'flex', justifyContent: 'space-evenly' }} value="participants" label="Participants" />
                </Tabs>
                {tabName === 'problems' &&
                    <ProblemsInContestView contestId={Number(contestId)} />}
            </Box>
        </>

    );
};
