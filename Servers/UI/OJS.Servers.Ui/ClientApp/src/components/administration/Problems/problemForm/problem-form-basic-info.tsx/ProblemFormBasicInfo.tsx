/* eslint-disable css-modules/no-unused-class */
/* eslint-disable @typescript-eslint/ban-types */
import React, { useEffect, useState } from 'react';
import { Box, Checkbox, Divider, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import isNaN from 'lodash/isNaN';

import { ContestVariation } from '../../../../../common/contest-types';
import { ProblemGroupTypes } from '../../../../../common/enums';
import { CHECKER, CONTEST_ID, ID, MAXIMUM_POINTS, MEMORY_LIMIT, NAME, ORDER_BY, PROBLEM_GROUP_TYPE, SHOW_DETAILED_FEEDBACK, SHOW_RESULTS, SOURCE_CODE_SIZE_LIMIT, TIME_LIMIT } from '../../../../../common/labels';
import { IProblemAdministration } from '../../../../../common/types';
import { useGetCheckersForProblemQuery } from '../../../../../redux/services/admin/checkersAdminService';
import { useGetIdsByContestIdQuery } from '../../../../../redux/services/admin/problemGroupsAdminService';

import formStyles from '../../../common/styles/FormStyles.module.scss';

interface IProblemFormBasicInfoProps {
    onChange: Function;
    currentProblem: IProblemAdministration;
}
const ProblemFormBasicInfo = (props: IProblemFormBasicInfoProps) => {
    const { onChange, currentProblem } = props;
    const { data: checkers } = useGetCheckersForProblemQuery(null);
    const [ problemGroupIds, setProblemGroupsIds ] = useState<Array<number>>([]);

    const { data: problemGroupData } = useGetIdsByContestIdQuery(currentProblem.contestId, { skip: currentProblem.contestId <= 0 });

    useEffect(() => {
        if (problemGroupData) {
            setProblemGroupsIds(problemGroupData);
        }
    }, [ problemGroupData ]);

    return (
        <Box className={formStyles.inputRow}>
            <Typography className={formStyles.dividerLabel} variant="h4">Basic info</Typography>
            <Divider className={formStyles.inputRow} />
            <Box className={formStyles.row}>
                <FormGroup className={formStyles.inlineElement}>
                    <FormControl className={formStyles.spacing}>
                        <TextField
                          variant="standard"
                          label={ID}
                          value={currentProblem?.id}
                          InputLabelProps={{ shrink: true }}
                          type="text"
                          disabled
                        />
                    </FormControl>
                    <FormControl className={formStyles.spacing}>
                        <TextField
                          variant="standard"
                          label={NAME}
                          value={currentProblem?.name}
                          InputLabelProps={{ shrink: true }}
                          type="text"
                          name="name"
                          onChange={(e) => onChange(e)}
                        />
                    </FormControl>
                    <FormControl className={formStyles.spacing}>
                        <TextField
                          variant="standard"
                          label={MAXIMUM_POINTS}
                          value={currentProblem?.maximumPoints}
                          InputLabelProps={{ shrink: true }}
                          type="number"
                          name="maximumPoints"
                          onChange={(e) => onChange(e)}
                        />
                    </FormControl>
                    <FormControl className={formStyles.spacing}>
                        <TextField
                          variant="standard"
                          label={SOURCE_CODE_SIZE_LIMIT}
                          value={currentProblem?.sourceCodeSizeLimit}
                          InputLabelProps={{ shrink: true }}
                          type="number"
                          name="sourceCodeSizeLimit"
                          onChange={(e) => onChange(e)}
                        />
                    </FormControl>
                </FormGroup>
                <FormGroup className={formStyles.inlineElement}>
                    <FormControl className={formStyles.spacing}>
                        <TextField
                          variant="standard"
                          label={ORDER_BY}
                          value={currentProblem?.orderBy}
                          InputLabelProps={{ shrink: true }}
                          type="number"
                          name="orderBy"
                          onChange={(e) => onChange(e)}
                        />
                    </FormControl>
                    <FormControl className={formStyles.spacing}>
                        <TextField
                          variant="standard"
                          label={CONTEST_ID}
                          value={currentProblem?.contestId}
                          InputLabelProps={{ shrink: true }}
                          type="number"
                          name="contestId"
                          onChange={(e) => onChange(e)}
                          disabled
                        />
                    </FormControl>
                    <FormControl className={formStyles.spacing}>
                        <TextField
                          variant="standard"
                          label={MEMORY_LIMIT}
                          value={currentProblem?.memoryLimit}
                          InputLabelProps={{ shrink: true }}
                          type="number"
                          name="memoryLimit"
                          onChange={(e) => onChange(e)}
                        />
                    </FormControl>
                    <FormControl className={formStyles.spacing}>
                        <TextField
                          variant="standard"
                          label={TIME_LIMIT}
                          value={currentProblem?.timeLimit}
                          InputLabelProps={{ shrink: true }}
                          type="number"
                          name="timeLimit"
                          onChange={(e) => onChange(e)}
                        />
                    </FormControl>
                </FormGroup>
            </Box>
            <FormGroup className={formStyles.selectFormGroup}>
                <InputLabel id="problemGroupType">{PROBLEM_GROUP_TYPE}</InputLabel>
                <Select
                  onChange={(e) => onChange(e)}
                  onBlur={(e) => onChange(e)}
                  labelId="problemGroupType"
                  value={currentProblem.problemGroupType}
                  name="problemGroupType"
                >
                    {Object.keys(ProblemGroupTypes).filter((key) => isNaN(Number(key))).map((key) => (
                        <MenuItem key={key} value={key}>
                            {key}
                        </MenuItem>
                    ))}
                </Select>
            </FormGroup>
            {currentProblem.contestType === ContestVariation.OnlinePracticalExam && (
            <FormGroup className={formStyles.selectFormGroup}>
                <InputLabel id="problemGroupOrderBy">Problem Group Order By</InputLabel>
                <Select
                  onChange={(e) => onChange(e)}
                  onBlur={(e) => onChange(e)}
                  labelId="problemGroupId"
                  value={currentProblem.problemGroupOrderBy}
                  name="problemGroupOrderBy"
                >
                    {problemGroupIds.map((key) => (
                        <MenuItem key={key} value={key}>
                            {key}
                        </MenuItem>
                    ))}
                </Select>
            </FormGroup>
            )}
            <FormGroup className={formStyles.selectFormGroup}>
                <InputLabel id="problemGroupType">{CHECKER}</InputLabel>
                <Select
                  onChange={(e) => onChange(e)}
                  onBlur={(e) => onChange(e)}
                  labelId="checkerId"
                  value={currentProblem.checkerId}
                  name="checkerId"
                >
                    {checkers?.map((c) => (
                        <MenuItem key={c.id} value={Number(c.id)}>
                            {c.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormGroup>
            <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={currentProblem.showDetailedFeedback} />}
                  label={SHOW_DETAILED_FEEDBACK}
                  name="showDetailedFeedback"
                  onChange={(e) => onChange(e)}
                />
                <FormControlLabel
                  control={(
                      <Checkbox
                        checked={currentProblem.showResults}
                      />
                    )}
                  name="showResults"
                  onChange={(e) => onChange(e)}
                  label={SHOW_RESULTS}
                />
            </FormGroup>
        </Box>
    );
};
export default ProblemFormBasicInfo;
