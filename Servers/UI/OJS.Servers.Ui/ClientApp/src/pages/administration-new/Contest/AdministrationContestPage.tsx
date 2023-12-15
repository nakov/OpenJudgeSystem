/* eslint-disable max-len */
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Slide, Tab, Tabs } from '@mui/material';

import { ContestEdit } from '../../../components/administration/Contests/ContestEdit/ContestEdit';
import { ProblemsInContestView } from '../../../components/administration/Contests/ContestEdit/problems/problemsInContestView/ProblemsInContestView';

import styles from './AdministrationContestPage.module.scss';

const AdministrationContestPage = () => {
    const { pathname } = useLocation();
    // this would be best to be set in redux state on button press in the mai grid, keeping this only for demonstariton
    // eslint-disable-next-line prefer-destructuring
    const contestId = pathname.split('/')[pathname.split('/').length - 1];
    const [ tabName, setTabName ] = useState('problems');

    const onTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabName(newValue);
    };

    return (
        <Slide direction="left" in mountOnEnter unmountOnExit timeout={300}>
            <Box>
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
            </Box>
        </Slide>
    );
};
export default AdministrationContestPage;
