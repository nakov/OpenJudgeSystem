import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import isNil from 'lodash/isNil';

import { IReplaceSubmissionTypeModel } from '../../../common/types';
import FormActionButton from '../../../components/administration/form-action-button/FormActionButton';
import {
    useGetForProblemQuery, useReplaceSubmissionTypeMutation,
} from '../../../redux/services/admin/submissionTypesAdminService';
import isNilOrEmpty from '../../../utils/check-utils';
import concatClassNames from '../../../utils/class-names';

// eslint-disable-next-line css-modules/no-unused-class
import formStyles from '../../../components/administration/common/styles/FormStyles.module.scss';
import styles from './AdministrationReplaceDeleteSubmissionTypesPage.module.scss';

const AdministrationReplaceDeleteSubmissionTypesPage = () => {
    const [ validations, setValidations ] = useState({
        isSubmissionTypeToReplaceTouched: false,
        isSubmissionTypeToReplaceValid: true,
        isReplaceWithTouched: false,
        isReplaceWithValid: true,
    });

    const [ submissionTypeToReplace, setSubmissionTypeToReplace ] = useState<string | null>();
    const [ replaceWith, setReplaceWith ] = useState<string | null>();
    const [ submissionTypeIdToReplace, setSubmissionTypeIdToReplace ] = useState<number | null>();
    const [ replaceWithId, setReplaceWithId ] = useState<number | null>();

    const SUBMISSION_TYPE_TO_REPLACE_FIELD_NAME = 'submission-type-to-replace';
    const REPLACE_WITH_FIELD_NAME = 'replace-with';

    const {
        data: submissionTypesData,
        isLoading: areSubmissionTypesLoading,
    } = useGetForProblemQuery(null);

    const [
        replaceSubmissionType,
        {
            data: replaceResult,
            error,
            isSuccess: isSuccessfullyReplaced,
            isLoading: isReplaceLoading,
        },
    ] = useReplaceSubmissionTypeMutation();

    const findSubmissionTypeId = (nameValue: string) => submissionTypesData!
        .find((st) => st.name === nameValue)!.id;

    const onChange = (e: any) => {
        const { name, value, checked } = e.target;
        const currentValidations = validations;
        // eslint-disable-next-line default-case
        switch (name) {
        case SUBMISSION_TYPE_TO_REPLACE_FIELD_NAME: {
            if (isNil(value)) {
                currentValidations.isSubmissionTypeToReplaceValid = false;
                break;
            }

            setSubmissionTypeToReplace(value);
            setSubmissionTypeIdToReplace(findSubmissionTypeId(value));
            currentValidations.isSubmissionTypeToReplaceValid = true;
            break;
        }
        case REPLACE_WITH_FIELD_NAME: {
            setReplaceWith(value);
            setReplaceWithId(findSubmissionTypeId(value));
            break;
        }
        }
        setValidations(currentValidations);
    };

    const submit = () => {
        replaceSubmissionType({
            submissionTypeToReplace: submissionTypeIdToReplace,
            submissionTypeToReplaceWith: replaceWithId,
        } as IReplaceSubmissionTypeModel);
    };

    return (
        <>
            <h1>Replace/delete submission types</h1>
            <div className={styles.pageContentContainer}>
                {
                    !areSubmissionTypesLoading && (
                    <form className={concatClassNames(formStyles.form, styles.replaceSubmissionTypesForm)}>
                        <FormControl
                          className={formStyles.inputRow}
                        >
                            <InputLabel id={SUBMISSION_TYPE_TO_REPLACE_FIELD_NAME}>Submission type</InputLabel>
                            <Select
                              sx={{ width: '100%' }}
                              variant="standard"
                              value={isNilOrEmpty(submissionTypeToReplace)
                                  ? ''
                                  : submissionTypeToReplace}
                              className={formStyles.inputRow}
                              name={SUBMISSION_TYPE_TO_REPLACE_FIELD_NAME}
                              labelId={SUBMISSION_TYPE_TO_REPLACE_FIELD_NAME}
                              onChange={(e) => onChange(e)}
                              onBlur={(e) => onChange(e)}
                              color={validations.isSubmissionTypeToReplaceValid && validations.isSubmissionTypeToReplaceTouched
                                  ? 'success'
                                  : 'primary'}
                              error={(validations.isSubmissionTypeToReplaceTouched && !validations.isSubmissionTypeToReplaceValid)}
                            >
                                {!isNil(submissionTypesData) && submissionTypesData.map((st) => (
                                    <MenuItem key={st.id} value={st.name}>
                                        {st.id}
                                        :
                                        {st.name}
                                    </MenuItem>
                                ))}
                                helperText=
                                {(validations.isSubmissionTypeToReplaceTouched &&
                                        !validations.isSubmissionTypeToReplaceValid) &&
                                    'Invalid submission type to replace'}
                            </Select>
                        </FormControl>
                        <FormControl
                          className={formStyles.inputRow}
                        >
                            <InputLabel id={REPLACE_WITH_FIELD_NAME}>Replace with</InputLabel>
                            <Select
                              sx={{ width: '100%' }}
                              variant="standard"
                              value={isNilOrEmpty(replaceWith)
                                  ? ''
                                  : replaceWith}
                              className={formStyles.inputRow}
                              name={REPLACE_WITH_FIELD_NAME}
                              labelId={REPLACE_WITH_FIELD_NAME}
                              onChange={(e) => onChange(e)}
                              onBlur={(e) => onChange(e)}
                              color={validations.isReplaceWithValid && validations.isReplaceWithTouched
                                  ? 'success'
                                  : 'primary'}
                              error={(validations.isReplaceWithTouched && !validations.isReplaceWithValid)}
                            >
                                {!isNil(submissionTypesData) && submissionTypesData.map((st) => (
                                    <MenuItem key={st.id} value={st.name}>
                                        {st.id}
                                        :
                                        {st.name}
                                    </MenuItem>
                                ))}
                                helperText=
                                {(validations.isSubmissionTypeToReplaceTouched &&
                                        !validations.isSubmissionTypeToReplaceValid) &&
                                    'Invalid submission type to replace'}
                            </Select>
                        </FormControl>
                        <FormActionButton
                          name="Find And Replace All"
                          onClick={() => submit()}
                          disabled={!validations.isSubmissionTypeToReplaceValid}
                        />
                    </form>
                    )
}
                <div className={styles.resultContainer}>
                    <h2>Result</h2>
                    {!isReplaceLoading && isSuccessfullyReplaced && (<p>{replaceResult}</p>)}
                </div>
            </div>
        </>
    );
};

export default AdministrationReplaceDeleteSubmissionTypesPage;
