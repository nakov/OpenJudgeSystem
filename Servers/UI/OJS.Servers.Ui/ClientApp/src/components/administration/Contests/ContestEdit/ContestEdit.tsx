import React, { useEffect, useState } from 'react';
import { Box, Checkbox, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Select, TextareaAutosize, TextField, Typography } from '@mui/material';
// eslint-disable-next-line no-restricted-imports
import { isNaN } from 'lodash';
import moment from 'moment';

import { IContestAdministration } from '../../../../common/types';
import { useGetContestByIdQuery } from '../../../../redux/services/admin/contestsAdminService';
import Button from '../../../guidelines/buttons/Button';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';

// eslint-disable-next-line import/no-unresolved
import styles from './ContestEdit.module.scss';

interface IContestEditProps {
    contestId: number;
}

enum ContestType {
  Exercise = 0,
  OnsitePracticalExam = 1,
  OnlinePracticalExam = 2,
  Lab = 3,
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
        [ data ],
    );

    const onChange = (fieldName: string, value: any) => {
        const editedContest = { ...contest };
        // eslint-disable-next-line default-case
        switch (fieldName) {
        case 'name':
            editedContest.name = value;
            break;
        case 'limitBetweenSubmissions':
            editedContest.limitBetweenSubmissions = Number(value);
            break;
        case 'autoChangeTestsFeedbackVisibility':
            editedContest.autoChangeTestsFeedbackVisibility = value;
            break;
        case 'allowParallelSubmissionsInTasks':
            editedContest.allowParallelSubmissionsInTasks = value;
            break;
        case 'isVisible':
            editedContest.isVisible = value;
            break;
        }

        setContest(editedContest);
    };

    return (
        isFetching || isLoading
            ? <SpinningLoader />
            : (
                <div className={`${styles.flex}`} style={{ height: '90%' }}>
                    <Typography className={styles.centralize} variant="h4">
                        {contest.name}
                    </Typography>
                    <form className={`${styles.form}`}>
                        <Box className={`${styles.fieldBox}`}>
                            <Box>
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
                                  name="name"
                                  onChange={(e: { target: { name: string; value: string } }) => onChange(e.target.name, e.target.value)}
                                  value={contest.name}
                                />
                                <FormControl
                                  className={styles.inputRow}
                                >
                                    <InputLabel id="contest-type">Type</InputLabel>
                                    <Select
                                      variant="standard"
                                      value={contest.type}
                                      className={styles.inputRow}
                                      labelId="contest-type"
                                    >
                                        {Object.keys(ContestType).filter((key) => isNaN(Number(key))).map((key) => (
                                            <MenuItem key={key} value={key}>
                                                {key}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                  className={styles.inputRow}
                                  label="Category Name"
                                  variant="standard"
                                  value={contest.categoryName}
                                  name="categoryName"
                                  onChange={(e: { target: { name: string; value: string } }) => onChange(e.target.name, e.target.value)}
                                  multiline
                                  type="text"
                                />
                                <TextField
                                  className={styles.inputRow}
                                  type="number"
                                  name="limitBetweenSubmissions"
                                  label="Limit between submissions"
                                  variant="standard"
                                  onChange={(e: any) => onChange(e.target.name, e.target.value)}
                                  value={contest.limitBetweenSubmissions}
                                  InputLabelProps={{ shrink: true }}
                                />
                            </Box>
                            <Box>
                                <TextField
                                  className={styles.inputRow}
                                  type="text"
                                  label="Contest Password"
                                  variant="standard"
                                  value={contest.contestPassword}
                                  name="contestPassword"
                                  onChange={(e: { target: { name: string; value: string } }) => onChange(e.target.name, e.target.value)}
                                  InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                  className={styles.inputRow}
                                  type="text"
                                  label="Practice Password"
                                  variant="standard"
                                  name="practicePassword"
                                  onChange={(e: { target: { name: string; value: string } }) => onChange(e.target.name, e.target.value)}
                                  value={contest.practicePassword}
                                  InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                  className={styles.inputRow}
                                  label="New Ip password"
                                  variant="standard"
                                  value={contest.newIpPassword}
                                  name="newIpPassword"
                                  onChange={(e: { target: { name: string; value: string } }) => onChange(e.target.name, e.target.value)}
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
                                <TextField
                                  className={styles.inputRow}
                                  type="text"
                                  label="Allowed Ips"
                                  variant="standard"
                                  value={contest.allowedIps}
                                  InputLabelProps={{ shrink: true }}
                                />
                            </Box>
                        </Box>
                        <FormControl className={styles.textArea}>
                            <FormLabel>Description</FormLabel>
                            <TextareaAutosize
                              placeholder="Enter description here..."
                              value={contest.description}
                              minRows={10}
                            />
                        </FormControl>
                        <div className={styles.row}>
                            <TextField
                              className={styles.inputRow}
                              label="Start Time"
                              variant="standard"
                              type="date"
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
                              type="date"
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
                              type="date"
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
                              type="date"
                              value={contest.practiceEndTime
                                  ? moment(contest.practiceEndTime).format('DD/MM/YYYY [at] h:mm A')
                                  : '-'}
                              InputLabelProps={{ shrink: true }}
                            />
                        </div>
                        <Box className={styles.flex}>
                            <FormControlLabel
                              control={<Checkbox checked={contest.isVisible} />}
                              label="IsVisible"
                              name="isVisible"
                              onChange={(e: { target: { name: string; value: string } }) => onChange(e.target.name, e.target.value)}
                            />
                            <FormControlLabel
                              control={<Checkbox checked={contest.allowParallelSubmissionsInTasks} />}
                              name="allowParallelSubmissionsInTasks"
                              onChange={(e: { target: { name: string; value: string } }) => onChange(e.target.name, e.target.value)}
                              label="Allow parallel submissions in tasks"
                            />
                            <FormControlLabel
                              control={<Checkbox checked={contest.autoChangeTestsFeedbackVisibility} />}
                              name="autoChangeTestsFeedbackVisibility"
                              onChange={(e: { target: { name: string; value: string } }) => onChange(e.target.name, e.target.value)}
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
