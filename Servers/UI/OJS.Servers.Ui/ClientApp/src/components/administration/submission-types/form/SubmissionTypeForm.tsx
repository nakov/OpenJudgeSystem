import { useEffect, useState } from 'react';
import { Checkbox, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Select, TextareaAutosize, TextField } from '@mui/material';

import { ADDITIONAL_COMPILER_ARGUMENTS, ALLOW_BINARY_FILES_UPLOAD, ALLOWED_FILE_EXTENSIONS, COMPILER, DESCRIPTION, EXECUTION_STRATEGY, ID, IS_SELECTED, NAME } from '../../../../common/labels';
import { useGetCompilersQuery, useGetExecutionStrategiesQuery } from '../../../../redux/services/admin/submissionTypesAdminService';

import formStyles from '../../common/styles/FormStyles.module.scss';

interface ISubmissionTypesFormProps {
    id: number | null;
    isEditMode: boolean;
}
const SubmissionTypesForm = (props : ISubmissionTypesFormProps) => {
    const { id, isEditMode } = props;
    const [ compilersData, setCompilersData ] = useState<Array<string>>([]);
    const [ strategiesData, setStrategiesData ] = useState<Array<string>>([]);
    const {
        data: compilers,
        isSuccess: isSuccesfullyGetingCompilers,
        error: compilerGetError,
        isLoading: isGettingCompilers,
    } = useGetCompilersQuery(null);

    const {
        data: executionStrategies,
        isSuccess: isSuccesfullyGetingStrategies,
        error: strategiesError,
        isLoading: isGettingStrategies,
    } = useGetExecutionStrategiesQuery(null);

    useEffect(() => {
        if (compilers) {
            setCompilersData(compilers);
        }
    }, [ compilers ]);

    useEffect(() => {
        if (executionStrategies) {
            setStrategiesData(executionStrategies);
        }
    }, [ executionStrategies ]);

    const onChange = (e: any) => {
        console.log('OnChange');
    };

    return (
        <form className={formStyles.form}>
            <FormControl className={formStyles.inputRow}>
                <TextField
                  variant="standard"
                  label={ID}
                  InputLabelProps={{ shrink: true }}
                  type="number"
                  onChange={(e) => onChange(e)}
                />
            </FormControl>
            <FormControl className={formStyles.inputRow}>
                <TextField
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  type="string"
                  name="name"
                  label={NAME}
                  onChange={(e) => onChange(e)}
                />
            </FormControl>
            <FormControl className={formStyles.inputRow}>
                <InputLabel id="execution-Strategy">{EXECUTION_STRATEGY}</InputLabel>
                <Select
                  sx={{ width: '100%' }}
                  variant="standard"
                //   value={contest.type}
                  name="executionStrategy"
                  labelId="execution-Strategy"
                  onChange={(e) => onChange(e)}
                  onBlur={(e) => onChange(e)}
                >
                    {strategiesData.map((c) => (
                        <MenuItem key={c} value={c}>
                            {c}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl className={formStyles.inputRow}>
                <InputLabel id="compiler">{COMPILER}</InputLabel>
                <Select
                  sx={{ width: '100%' }}
                  variant="standard"
                //   value={contest.type}
                  name="compiler"
                  labelId="compiler"
                  onChange={(e) => onChange(e)}
                  onBlur={(e) => onChange(e)}
                >
                    {compilersData.map((c) => (
                        <MenuItem key={c} value={c}>
                            {c}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl className={formStyles.inputRow}>
                <TextField
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  type="string"
                  label={ADDITIONAL_COMPILER_ARGUMENTS}
                  name="additionalCompilerArguments"
                  onChange={(e) => onChange(e)}
                />
            </FormControl>
            <FormControl className={formStyles.inputRow}>
                <FormLabel>{DESCRIPTION}</FormLabel>
                <TextareaAutosize
                //   placeholder={CONTEST_DESCRIPTION_PLACEHOLDER_MESSAGE}
                //   value={contest.description === null
                //       ? ''
                //       : contest.description}
                  minRows={10}
                  name="description"
                  onChange={(e) => onChange(e)}
                />
            </FormControl>
            <FormControl className={formStyles.inputRow}>
                <TextField
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                  type="string"
                  label={ALLOWED_FILE_EXTENSIONS}
                  name="allowedFileExtensions"
                  onChange={(e) => onChange(e)}
                />
            </FormControl>
            <FormControl className={formStyles.inputRow}>
                <FormControlLabel
                  control={<Checkbox />}
                  label={IS_SELECTED}
                  name="isSelected"
                  onChange={(e) => onChange(e)}
                />
            </FormControl>
            <FormControl className={formStyles.inputRow}>
                <FormControlLabel
                  control={<Checkbox />}
                  label={ALLOW_BINARY_FILES_UPLOAD}
                  name="allowBinaryFilesUpload"
                  onChange={(e) => onChange(e)}
                />
            </FormControl>
        </form>
    );
};

export default SubmissionTypesForm;
