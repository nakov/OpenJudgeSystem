import { useEffect, useState } from 'react';
import { Checkbox, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Select, TextareaAutosize, TextField } from '@mui/material';

import { ADDITIONAL_COMPILER_ARGUMENTS, ALLOW_BINARY_FILES_UPLOAD, ALLOWED_FILE_EXTENSIONS, COMPILER, DESCRIPTION, EXECUTION_STRATEGY, ID, IS_SELECTED, NAME } from '../../../../common/labels';
import { IExecutionStrategyTypes, ISubmissionTypeAdministrationModel } from '../../../../common/types';
import { useGetByIdQuery, useGetCompilersQuery, useGetExecutionStrategiesQuery } from '../../../../redux/services/admin/submissionTypesAdminService';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';

import formStyles from '../../common/styles/FormStyles.module.scss';

interface ISubmissionTypesFormProps {
    id: number | null;
    isEditMode: boolean;
}
const SubmissionTypesForm = (props : ISubmissionTypesFormProps) => {
    const { id, isEditMode } = props;
    const [ compilersData, setCompilersData ] = useState<Array<string>>([]);
    const [ strategiesData, setStrategiesData ] = useState<Array<string>>([]);

    const [ currentSubmissionType, setCurrentSubmissionType ] = useState<ISubmissionTypeAdministrationModel>({
        name: '',
        additionalCompilerArguments: '',
        compilerType: '',
        description: '',
        executionStrategyType: '',
        id: 0,
        isSelectedByDefault: false,
        allowedFileExtensions: '',
        allowBinaryFilesUpload: false,

    });
    const {
        data: compilers,
        isSuccess: isSuccesfullyGetingCompilers,
        error: compilerGetError,
        isLoading: isGettingCompilers,
    } = useGetCompilersQuery(null);

    const {
        data: submissionType,
        isLoading: isGettingSubmissionType,
        error: gettingSubmissionTypeError,
        isSuccess: isSuccessfullyGettingST,
    } = useGetByIdQuery(id || 0, { skip: !isEditMode });

    const {
        data: executionStrategies,
        isSuccess: isSuccesfullyGetingStrategies,
        error: strategiesError,
        isLoading: isGettingStrategies,
    } = useGetExecutionStrategiesQuery(null);

    useEffect(() => {
        if (submissionType) {
            setCurrentSubmissionType(submissionType);
        }
    }, [ submissionType ]);

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
        const { target } = e;
        const { name, type, value, checked } = target;
        setCurrentSubmissionType((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox'
                ? checked
                : type === 'number'
                    ? value === ''
                        ? ''
                        : Number(value)
                    : value,
        }));
    };

    if (isGettingCompilers || isGettingStrategies || isGettingSubmissionType) {
        return <SpinningLoader />;
    }

    return (
        <form className={formStyles.form}>
            <FormControl className={formStyles.inputRow}>
                <TextField
                  variant="standard"
                  label={ID}
                  InputLabelProps={{ shrink: true }}
                  type="number"
                  value={currentSubmissionType.id}
                  disabled
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
                  value={currentSubmissionType.name}
                />
            </FormControl>
            <FormControl className={formStyles.inputRow}>
                <InputLabel id="execution-Strategy">{EXECUTION_STRATEGY}</InputLabel>
                <Select
                  sx={{ width: '100%' }}
                  variant="standard"
                  value={currentSubmissionType.executionStrategyType}
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
                  value={currentSubmissionType.compilerType}
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
                  value={currentSubmissionType.additionalCompilerArguments}
                />
            </FormControl>
            <FormControl className={formStyles.inputRow}>
                <FormLabel>{DESCRIPTION}</FormLabel>
                <TextareaAutosize
                  minRows={10}
                  name="description"
                  onChange={(e) => onChange(e)}
                  value={currentSubmissionType.description ?? ''}
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
                  value={currentSubmissionType.allowedFileExtensions}
                />
            </FormControl>
            <FormControl className={formStyles.inputRow}>
                <FormControlLabel
                  control={<Checkbox checked={currentSubmissionType.isSelectedByDefault} />}
                  label={IS_SELECTED}
                  name="isSelectedByDefault"
                  onChange={(e) => onChange(e)}
                />
            </FormControl>
            <FormControl className={formStyles.inputRow}>
                <FormControlLabel
                  control={<Checkbox checked={currentSubmissionType.allowBinaryFilesUpload} />}
                  label={ALLOW_BINARY_FILES_UPLOAD}
                  name="allowBinaryFilesUpload"
                  onChange={(e) => onChange(e)}
                />
            </FormControl>
        </form>
    );
};

export default SubmissionTypesForm;
