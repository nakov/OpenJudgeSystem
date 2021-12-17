import * as React from 'react';
import { useEffect, useState } from 'react';

import { Box, Tab, createTheme, ThemeProvider } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';

import { setLayout } from '../shared/set-layout';
import { useUsers } from '../../hooks/use-users';
import Heading from '../../components/guidelines/headings/Heading';
import ProfileAboutInfo from '../../components/profile/profile-about-info/ProfileAboutInfo';

import styles from './ProfilePage.module.scss';
import ProfileSubmissions from '../../components/profile/profile-submissions/ProfileSubmisssions';
import ProfileContestParticipations
    from '../../components/profile/profile-contest-participations/ProfileContestParticipations';

const ProfilePage = () => {
    const { profile, getProfile } = useUsers();
    const [ value, setValue ] = useState('1');

    useEffect(() => {
        getProfile();
    }, [ getProfile ]);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setValue(newValue);
    };

    useEffect(() => {
    }, [ value ]);

    const theme = createTheme({
        overrides:
            {
                MuiTabs: {
                    indicator: { backgroundColor: '#42abf8', height: 3 },
                    root: {},
                },
            },
    });

    return (
        <>
            <Heading>Profile</Heading>
            <ProfileAboutInfo value={profile} />
            <ThemeProvider theme={theme}>
                <Box sx={{ width: '100%' }}>
                    <TabContext value={value}>
                        <Box>
                            <TabList onChange={handleChange}>
                                <Tab label="Submissions" value="1" className={styles.tab} />
                                <Tab label="Contest Participations" value="2" className={styles.tab} />
                            </TabList>
                        </Box>
                        <TabPanel value="1"><ProfileSubmissions /></TabPanel>
                        <TabPanel value="2"><ProfileContestParticipations /></TabPanel>
                    </TabContext>
                </Box>
            </ThemeProvider>
        </>
    );
};

export default setLayout(ProfilePage);
