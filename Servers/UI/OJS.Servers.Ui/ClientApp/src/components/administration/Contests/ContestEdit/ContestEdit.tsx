import React, { useEffect, useState } from 'react';
import { Box, Checkbox, FormControlLabel, TextareaAutosize, TextField, Typography } from '@mui/material';
import moment from 'moment';

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

const ContestEdit = (props:IContestEditProps) => {
    const { contestId } = props;

    const { data, isFetching, isLoading } = useGetContestByIdQuery({ id: Number(contestId) });
    const [ contest, setContest ] = useState<IContestAdministration>({} as IContestAdministration);

    const edit = () => console.log('edit => ');

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
                <div style={{ height: '90%' }}>
                    <Typography className={styles.centralize} variant="h4">
                        {contest.name}
                    </Typography>
                    <form className={`${styles.flex} ${styles.form}`}>
                        <TextField
                          className={styles.inputRow}
                          label="Contest Id"
                          variant="standard"
                          value={contest.id}
                        />
                        <TextField
                          className={styles.inputRow}
                          label="Name"
                          variant="standard"
                          value={contest.name}
                        />
                        <TextField
                          className={styles.inputRow}
                          label="Category Name"
                          variant="standard"
                          value={contest.categoryName}
                          multiline
                          type="text"
                        />
                        <TextareaAutosize className={styles.inputRow} value={contest.description} minRows={10} />
                        <div className={styles.row}>
                            <TextField
                              className={styles.inputRow}
                              label="Start Time"
                              variant="standard"
                              value={contest.startTime
                                  ? moment(contest.startTime).format('DD/MM/YYYY [at] h:mm A')
                                  : '-'}
                              InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                              style={{ marginLeft: '30px' }}
                              className={styles.inputRow}
                              label="End Time"
                              variant="standard"
                              value={contest.endTime
                                  ? moment(contest.endTime).format('DD/MM/YYYY [at] h:mm A')
                                  : '-'}
                              InputLabelProps={{ shrink: true }}
                            />
                        </div>
                        <div className={styles.row}>
                            <TextField
                              className={styles.inputRow}
                              label="Practice Start Time"
                              variant="standard"
                              value={contest.practiceStartTime
                                  ? moment(contest.practiceStartTime).format('DD/MM/YYYY [at] h:mm A')
                                  : '-'}
                              InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                              style={{ marginLeft: '30px' }}
                              className={styles.inputRow}
                              label="Practice End Time"
                              variant="standard"
                              value={contest.practiceEndTime
                                  ? moment(contest.practiceEndTime).format('DD/MM/YYYY [at] h:mm A')
                                  : '-'}
                              InputLabelProps={{ shrink: true }}
                            />
                        </div>
                        <TextField
                          className={styles.inputRow}
                          type="number"
                          label="Limit between submissions"
                          variant="standard"
                          value={contest.limitBetweenSubmissions}
                          InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                          className={styles.inputRow}
                          label="New Ip password"
                          variant="standard"
                          value={contest.newIpPassword}
                          type="text"
                        />
                        <TextField
                          className={styles.inputRow}
                          type="number"
                          label="Order By"
                          variant="standard"
                          value={contest.orderBy}
                          InputLabelProps={{ shrink: true }}
                        />
                        <Box className={styles.flex}>
                            <FormControlLabel
                              control={<Checkbox checked={contest.isVisible || false} />}
                              label="IsVisible"
                            />
                            <FormControlLabel
                              control={<Checkbox defaultChecked={contest.allowParallelSubmissionsInTasks || false} />}
                              label="Allow parallel submissions in tasks"
                            />
                            <FormControlLabel
                              control={<Checkbox defaultChecked={contest.autoChangeTestsFeedbackVisibility || false} />}
                              label="Auto change tests feedback visibility"
                            />
                        </Box>
                        <Button onClick={() => edit()} className={styles.edit}>Edit</Button>
                    </form>
                </div>
            )
    );
};

export default ContestEdit;
