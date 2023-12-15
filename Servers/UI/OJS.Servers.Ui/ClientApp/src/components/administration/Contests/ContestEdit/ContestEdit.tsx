/* eslint-disable react/destructuring-assignment */
/* eslint-disable max-len */
import { React, useEffect, useState } from 'react';
import { Box, Checkbox, FormControlLabel, TextareaAutosize, TextField, Typography } from '@mui/material';

import { IContestAdministration } from '../../../../common/types';
import { useGetContestByIdQuery } from '../../../../redux/services/admin/contestsAdminService';
import Button from '../../../guidelines/buttons/Button';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';

// eslint-disable-next-line import/no-unresolved
import styles from './ContestEdit.module.scss';

// eslint-disable-next-line import/prefer-default-export
interface IContestEditProps {
    contestId: number;
}

export const ContestEdit = (props:IContestEditProps) => {
    const { data, isFetching, isLoading } = useGetContestByIdQuery({ id: Number(props.contestId) });
    const [ contest, setContest ] = useState<IContestAdministration>({} as IContestAdministration);

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const edit = () => { };

    useEffect(
        () => {
            if (data) {
                setContest(data);
            }
        },
        [ data, setContest, contest ],
    );

    return (
        isFetching || isLoading
            ? <SpinningLoader />
            : (
                <>
                    <Typography className={styles.centralize} variant="h3">
                        {contest.name}
                    </Typography>
                    <form className={`${styles.flex} ${styles.spacing} ${styles.form}`}>
                        <TextField className={`${styles.halfWidth} ${styles.spacing}`} label="Contest Id" variant="standard" value={contest.id} />
                        <TextField className={`${styles.halfWidth} ${styles.spacing}`} label="Name" variant="standard" value={contest.name} />
                        <TextField className={`${styles.halfWidth} ${styles.spacing}`} label="CategoryName" variant="standard" value={contest.categoryName} multiline type="text" />
                        <TextareaAutosize className={`${styles.halfWidth} ${styles.spacing}`} value={contest.description} minRows={10} />
                        <TextField className={`${styles.halfWidth} ${styles.spacing}`} label="StartTime" variant="standard" value={Date.parse(contest.startTime)} InputLabelProps={{ shrink: true }} type="date" />
                        <TextField className={`${styles.halfWidth} ${styles.spacing}`} label="EndTime" variant="standard" value={contest.endTime} type="date" InputLabelProps={{ shrink: true }} />
                        <TextField className={`${styles.halfWidth} ${styles.spacing}`} label="PracticeStartTime" variant="standard" value={contest.practiceStartTime} type="date" InputLabelProps={{ shrink: true }} />
                        <TextField className={`${styles.halfWidth} ${styles.spacing}`} label="PracticeEndTime" variant="standard" value={contest.practiceEndTime} type="date" InputLabelProps={{ shrink: true }} />
                        <TextField className={`${styles.halfWidth} ${styles.spacing}`} type="number" label="Limit between submissions" variant="standard" value={contest.limitBetweenSubmissions} InputLabelProps={{ shrink: true }} />
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
                            <FormControlLabel control={<Checkbox checked={contest.isVisible || false} />} label="IsVisible" />
                            <FormControlLabel control={<Checkbox defaultChecked={contest.allowParallelSubmissionsInTasks || false} />} label="Allow parallel submissions in tasks" />
                            <FormControlLabel control={<Checkbox defaultChecked={contest.autoChangeTestsFeedbackVisibility || false} />} label="AutoChangeTestsFeedbackVisibility" />
                        </Box>
                        <Button onClick={() => edit()} className={styles.edit}>Edit</Button>
                    </form>
                </>
            )
    );
};
export default ContestEdit;
