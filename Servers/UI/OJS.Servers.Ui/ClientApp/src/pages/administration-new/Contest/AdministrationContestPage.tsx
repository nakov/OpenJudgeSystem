/* eslint-disable max-len */
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Slide, Tab, Tabs } from '@mui/material';

import ContestEdit from '../../../components/administration/Contests/ContestEdit/ContestEdit';
import ParticipantsInContestView from '../../../components/administration/Contests/ContestEdit/problems/participantsInContestView/ParticipantsInContestView';
import ProblemsInContestView from '../../../components/administration/Contests/ContestEdit/problems/problemsInContestView/ProblemsInContestView';

import styles from './AdministrationContestPage.module.scss';

enum CONTEST_LISTED_DATA {
    PROBLEMS = 'problems',
    PARTICIPANTS = 'participants'
}

const AdministrationContestPage = () => {
    const { pathname } = useLocation();
    const [ , , , contestId ] = pathname.split('/');
    const [ tabName, setTabName ] = useState(CONTEST_LISTED_DATA.PROBLEMS);

    const onTabChange = (event: React.SyntheticEvent, newValue: CONTEST_LISTED_DATA) => {
        setTabName(newValue);
    };

    return (
        <Slide direction="left" in mountOnEnter unmountOnExit timeout={300}>
            <div>
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
                        {tabName === 'participants' &&
                        <ParticipantsInContestView contestId={Number(contestId)} />}
                    </Box>
                </Box>
            </div>
        </Slide>
    );
};
export default AdministrationContestPage;
