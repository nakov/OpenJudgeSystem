/* eslint-disable react/jsx-no-undef */
/* eslint-disable max-len */
/* eslint-disable react/jsx-one-expression-per-line */

import React, { useEffect, useState } from 'react';
// eslint-disable-next-line no-restricted-imports
import { useLocation } from 'react-router-dom';
import { Checkbox, TextField, Typography } from '@material-ui/core';
import { Box, FormControlLabel, Tab, Tabs, TextareaAutosize } from '@mui/material';

import { IContestAdministration } from '../../../common/types';
import Button from '../../../components/guidelines/buttons/Button';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import { useGetContestByIdQuery } from '../../../redux/services/admin/contestsAdminService';

import styles from './AdministrationContestPage.module.scss';
// eslint-disable-next-line import/prefer-default-export
export const AdministrationContestPage = () => {
    const { pathname } = useLocation();
    // this would be best to be set in redux state on button press in the mai grid, keeping this only for demonstariton
    const contestId = pathname.split('/')[pathname.split('/').length - 1];

    const { data, isFetching, isLoading } = useGetContestByIdQuery({ id: Number(contestId) });

    const [ contest, setContest ] = useState<IContestAdministration>({} as IContestAdministration);
    const [ tabName, setTabName ] = useState('problems');

    useEffect(
        () => {
            if (data) {
                setContest(data);
            }
        },
        [ data, setContest ],
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabName(newValue);
    };

    // eslint-disable-next-line arrow-body-style, @typescript-eslint/no-empty-function
    const edit = () => { };

    return (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
            {isFetching || isLoading
                ? <SpinningLoader />
                : (
                    <Box className={styles.paged}>
                        <Typography className={styles.centralize} variant="h3"> { contest.name }</Typography>
                        <form className={`${styles.flex} ${styles.spacing} ${styles.form}`}>
                            <TextField className={`${styles.halfWidth} ${styles.spacing}`} label="Name" variant="standard" value={contest.name} />
                            <TextField className={`${styles.halfWidth} ${styles.spacing}`} label="CategoryName" variant="standard" value={contest.categoryName} multiline type="text" />
                            <TextareaAutosize className={`${styles.halfWidth} ${styles.spacing}`} value={contest.description} minRows={10} />
                            <TextField className={`${styles.halfWidth} ${styles.spacing}`} label="StartTime" variant="standard" value={contest.startTime} InputLabelProps={{ shrink: true }} type="date" />
                            <TextField className={`${styles.halfWidth} ${styles.spacing}`} label="EndTime" variant="standard" value={contest.endTime} type="date" InputLabelProps={{ shrink: true }} />
                            <TextField className={`${styles.halfWidth} ${styles.spacing}`} label="PracticeStartTime" variant="standard" value={contest.practiceStartTime} type="date" InputLabelProps={{ shrink: true }} />
                            <TextField className={`${styles.halfWidth} ${styles.spacing}`} label="PracticeEndTime" variant="standard" value={contest.practiceEndTime} type="date" InputLabelProps={{ shrink: true }} />
                            <TextField className={`${styles.halfWidth} ${styles.spacing}`} type="number" label="Limit between submissions" variant="standard" value={contest.limitBetweenSubmissions} />
                            <TextField className={`${styles.halfWidth} ${styles.spacing}`} label="New Ip password" variant="standard" value={contest.newIpPassword} type="text" />
                            <TextField
                              className={`${styles.halfWidth} ${styles.spacing}`}
                              type="number"
                              label="Order By"
                              variant="standard"
                              value={contest.orderBy}
                              InputLabelProps={{ shrink: true }}
                            />
                            <Box className={styles.flex}>
                                <FormControlLabel control={<Checkbox checked={contest.isVisible} />} label="IsVisible" />
                                <FormControlLabel control={<Checkbox defaultChecked={contest.allowParallelSubmissionsInTasks} />} label="Allow parallel submissions in tasks" />
                                <FormControlLabel control={<Checkbox defaultChecked={contest.autoChangeTestsFeedbackVisibility} />} label="AutoChangeTestsFeedbackVisibility" />
                            </Box>
                            <Button onClick={() => edit()} className={styles.edit}>Edit</Button>
                        </form>
                        <Tabs
                          sx={{ minWidth: '100%', display: 'flex', justifyContent: 'space-around' }}
                          value={tabName}
                          onChange={onTabChange}
                          aria-label="wrapped label tabs example"
                        >
                            <Tab
                              sx={{ minWidth: '45%', border: '2px solid red', display: 'flex', justifyContent: 'space-evenly' }}
                              value="problems"
                              label={`Problems for contest: ${contest.name}`}
                              wrapped
                            />
                            <Tab sx={{ minWidth: '45%', border: '2px solid red', display: 'flex', justifyContent: 'space-evenly' }} value="participants" label={`Participants for contest: ${contest.name}`} />
                        </Tabs>
                    </Box>
                )}
        </>

    );
};
