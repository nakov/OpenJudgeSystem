/* eslint-disable @typescript-eslint/ban-types */
import { Box, Checkbox, Divider, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import isNaN from 'lodash/isNaN';

import { ProblemGroupTypes } from '../../../../../common/enums';
import { CHECKER, CONTEST_ID, ID, MAXIMUM_POINTS, MEMORY_LIMIT, NAME, ORDER_BY, PROBLEM_GROUP_TYPE, SHOW_DETAILED_FEEDBACK, SHOW_RESULTS, SOURCE_CODE_SIZE_LIMIT, TIME_LIMIT } from '../../../../../common/labels';
import { IProblemAdministration } from '../../../../../common/types';
import { useGetCheckersForProblemQuery } from '../../../../../redux/services/admin/checkersAdminService';

interface IProblemFormBasicInfoProps {
    onChange: Function;
    currentProblem: IProblemAdministration;
}
const ProblemFormBasicInfo = (props: IProblemFormBasicInfoProps) => {
    const { onChange, currentProblem } = props;
    const { data: checkers } = useGetCheckersForProblemQuery(null);
    return (
        <>
            <Typography sx={{ marginTop: '1rem' }} variant="h4">Basic info</Typography>
            <Divider />
            <Box style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <FormGroup sx={{ width: '45%' }}>
                    <FormControl sx={{ margin: '1rem' }}>
                        <TextField
                          variant="standard"
                          label={ID}
                          value={currentProblem?.id}
                          InputLabelProps={{ shrink: true }}
                          type="text"
                          disabled
                        />
                    </FormControl>
                    <FormControl sx={{ margin: '1rem' }}>
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
                    <FormControl sx={{ margin: '1rem' }}>
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
                    <FormControl sx={{ margin: '1rem' }}>
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
                <FormGroup sx={{ width: '45%' }}>
                    <FormControl sx={{ margin: '1rem' }}>
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
                    <FormControl sx={{ margin: '1rem' }}>
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
                    <FormControl sx={{ margin: '1rem' }}>
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
                    <FormControl sx={{ margin: '1rem' }}>
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
            <FormGroup sx={{ margin: '0.5rem 0', width: '92%', alignSelf: 'center' }}>
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
            <FormGroup sx={{ margin: '0.5rem 0', width: '92%', alignSelf: 'center' }}>
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
            <FormGroup sx={{ marginLeft: '4rem' }}>
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
        </>
    );
};
export default ProblemFormBasicInfo;
