/* eslint-disable prefer-destructuring */
import React, { useEffect, useState } from 'react';
import { Box, Checkbox, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Select, TextareaAutosize, TextField, Typography } from '@mui/material';
// eslint-disable-next-line no-restricted-imports
import { isNaN } from 'lodash';
import moment from 'moment';

import { ContestVariation } from '../../../../common/contest-types';
import { IContestAdministration } from '../../../../common/types';
import { useGetContestByIdQuery } from '../../../../redux/services/admin/contestsAdminService';
import Button from '../../../guidelines/buttons/Button';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';

// eslint-disable-next-line import/no-unresolved
import styles from './ContestEdit.module.scss';

interface IContestEditProps {
    contestId: number;
}

const ContestEdit = (props:IContestEditProps) => {
    const { contestId } = props;

    const { data, isFetching, isLoading } = useGetContestByIdQuery({ id: Number(contestId) });
    const [ contest, setContest ] = useState<IContestAdministration>({
        allowedIps: '',
        allowParallelSubmissionsInTasks: false,
        autoChangeTestsFeedbackVisibility: false,
        categoryId: 0,
        categoryName: '',
        contestPassword: '',
        description: '',
        endTime: '',
        name: '',
        id: 0,
        isVisible: false,
        limitBetweenSubmissions: 0,
        newIpPassword: '',
        orderBy: 0,
        practiceEndTime: '',
        practicePassword: '',
        practiceStartTime: '',
        startTime: '',
        type: 'Exercise',
    });

    const edit = () => console.log('edit => ');

    useEffect(
        () => {
            if (data) {
                setContest(data);
            }
        },
        [ data ],
    );

    const onChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox'
            ? checked
            : value;

        setContest((prevContest) => ({
            ...prevContest,
            [name]: newValue,
        }));
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
                                  disabled
                                />
                                <TextField
                                  className={styles.inputRow}
                                  label="Name"
                                  variant="standard"
                                  name="name"
                                  onChange={(e) => onChange(e)}
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
                                      name="type"
                                      labelId="contest-type"
                                      onChange={(e) => onChange(e)}
                                    >
                                        {Object.keys(ContestVariation).filter((key) => isNaN(Number(key))).map((key) => (
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
                                  onChange={(e) => onChange(e)}
                                  multiline
                                  type="text"
                                />
                                <TextField
                                  className={styles.inputRow}
                                  type="number"
                                  name="limitBetweenSubmissions"
                                  label="Limit between submissions"
                                  variant="standard"
                                  onChange={(e) => onChange(e)}
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
                                  onChange={(e) => onChange(e)}
                                  InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                  className={styles.inputRow}
                                  type="text"
                                  label="Practice Password"
                                  variant="standard"
                                  name="practicePassword"
                                  onChange={(e) => onChange(e)}
                                  value={contest.practicePassword}
                                  InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                  className={styles.inputRow}
                                  label="New Ip password"
                                  variant="standard"
                                  value={contest.newIpPassword}
                                  name="newIpPassword"
                                  onChange={(e) => onChange(e)}
                                  type="text"
                                />
                                <TextField
                                  className={styles.inputRow}
                                  type="number"
                                  label="Order By"
                                  variant="standard"
                                  value={contest.orderBy}
                                  onChange={(e) => onChange(e)}
                                  InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                  className={styles.inputRow}
                                  type="text"
                                  label="Allowed Ips"
                                  variant="standard"
                                  value={contest.allowedIps}
                                  onChange={(e) => onChange(e)}
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
                              name="description"
                              onChange={(e) => onChange(e)}
                            />
                        </FormControl>
                        <div className={styles.row}>
                            <TextField
                              className={styles.inputRow}
                              label="Start Time"
                              variant="standard"
                              type="date"
                              onChange={(e) => onChange(e)}
                              name="startTime"
                              value={contest.startTime
                                  ? moment(contest.startTime).format('DD/MM/YYYY')
                                  : ''}
                              InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                              style={{ marginLeft: '30px' }}
                              className={styles.inputRow}
                              label="End Time"
                              variant="standard"
                              type="date"
                              name="endTime"
                              onChange={(e) => onChange(e)}
                              value={contest.endTime
                                  ? moment(contest.endTime).format('DD/MM/YYYY')
                                  : ''}
                              InputLabelProps={{ shrink: true }}
                            />
                        </div>
                        <div className={styles.row}>
                            <TextField
                              className={styles.inputRow}
                              label="Practice Start Time"
                              variant="standard"
                              type="date"
                              name="practiceStartTime"
                              onChange={(e) => onChange(e)}
                              value={contest.practiceStartTime
                                  ? moment(contest.practiceStartTime).format('DD/MM/YYYY')
                                  : ''}
                              InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                              style={{ marginLeft: '30px' }}
                              className={styles.inputRow}
                              label="Practice End Time"
                              variant="standard"
                              type="date"
                              name="practiceEndTime"
                              onChange={(e) => onChange(e)}
                              value={contest.practiceEndTime
                                  ? moment(contest.practiceEndTime).format('DD/MM/YYYY')
                                  : ''}
                              InputLabelProps={{ shrink: true }}
                            />
                        </div>
                        <Box className={styles.flex}>
                            <FormControlLabel
                              control={<Checkbox checked={contest.isVisible} />}
                              label="IsVisible"
                              name="isVisible"
                              onChange={(e) => onChange(e)}
                            />
                            <FormControlLabel
                              control={(
                                  <Checkbox
                                    checked={contest.allowParallelSubmissionsInTasks}
                                  />
                              )}
                              name="allowParallelSubmissionsInTasks"
                              onChange={(e) => onChange(e)}
                              label="Allow parallel submissions in tasks"
                            />
                            <FormControlLabel
                              control={(
                                  <Checkbox
                                    checked={contest?.autoChangeTestsFeedbackVisibility}
                                  />
                                )}
                              name="autoChangeTestsFeedbackVisibility"
                              onChange={(e) => onChange(e)}
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
