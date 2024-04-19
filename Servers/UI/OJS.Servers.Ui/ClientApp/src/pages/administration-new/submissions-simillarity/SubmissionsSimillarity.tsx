import { useEffect, useState } from 'react';
import { Autocomplete, debounce, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import isNaN from 'lodash/isNaN';

import { TYPE } from '../../../common/labels';
import { IContestAutocomplete } from '../../../common/types';
import FormActionButton from '../../../components/administration/form-action-button/FormActionButton';
import { useCheckSimilarityMutation, useGetContestAutocompleteQuery } from '../../../redux/services/admin/contestsAdminService';
import { getAndSetExceptionMessage } from '../../../utils/messages-utils';
import { renderErrorMessagesAlert } from '../../../utils/render-utils';

// eslint-disable-next-line css-modules/no-unused-class
import formStyles from '../../../components/administration/common/styles/FormStyles.module.scss';

// eslint-disable-next-line import/exports-last
export enum SimillarityType {
    Text = 3,
}

const SubmissionsSimillarity = () => {
    const [ contestAutocomplete, setContestsAutocomplete ] = useState<Array<IContestAutocomplete>>([]);
    const [ contestSearchString, setContestSearchString ] = useState<string>('');
    const [ contestId, setContestId ] = useState<number | null>(null);
    const [ similarityType, setSimillarityType ] = useState<SimillarityType>(SimillarityType.Text);
    const [ errorMessages, setErrorMessages ] = useState<Array<string>>([]);
    const {
        data: contestsAutocompleteData,
        error: getContestDataError,
    } = useGetContestAutocompleteQuery(contestSearchString);

    const [
        checkSimilarity,
        {
            isLoading,
            error: checkSimilarityError,
        },
    ] = useCheckSimilarityMutation();

    useEffect(() => {
        if (contestsAutocompleteData) {
            setContestsAutocomplete(contestsAutocompleteData);
        }
    }, [ contestsAutocompleteData ]);

    useEffect(() => {
        getAndSetExceptionMessage([ checkSimilarityError, getContestDataError ], setErrorMessages);
    }, [ getContestDataError, checkSimilarityError ]);

    const onInputChange = debounce((e: any) => {
        setContestSearchString(e.target.value);
    }, 300);

    const onSelect = (contest: IContestAutocomplete) => {
        setContestId(contest.id);
    };

    const onChange = (e: any) => {
        setSimillarityType(e.target.value as SimillarityType);
    };

    return (
        <>
            {renderErrorMessagesAlert(errorMessages)}
            <form className={`${formStyles.form}`}>
                <Typography variant="h4" className={formStyles.centralize}>
                    Submission similarity
                </Typography>
                <FormControl className={formStyles.inputRow}>
                    <Autocomplete
                      options={contestAutocomplete}
                      renderInput={(params) => <TextField {...params} label="Select Contest" key={params.id} />}
                      onChange={(event, newValue) => onSelect(newValue!)}
                      onInputChange={(event) => onInputChange(event)}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      getOptionLabel={(option) => option?.name}
                      renderOption={(properties, option) => (
                          <MenuItem {...properties} key={option.id} value={option.id}>
                              {option.name}
                          </MenuItem>
                      )}
                    />
                </FormControl>
                <FormControl className={formStyles.inputRow}>
                    <InputLabel id="similarity-type">{TYPE}</InputLabel>
                    <Select
                      sx={{ width: '100%' }}
                      variant="standard"
                      name="type"
                      value={similarityType}
                      labelId="similarity-type"
                      onChange={(e) => onChange(e)}
                      onBlur={(e) => onChange(e)}
                    >
                        {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
                        {Object.entries(SimillarityType).filter(([ key, value ]) => !isNaN(Number(value))).map(([ key, value ]) => (
                            <MenuItem key={key} value={value}>
                                {key}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormActionButton
                  name="Check simillarities"
                  disabled={!contestId || isLoading}
                  onClick={() => checkSimilarity({ contestIds: [ contestId! ], similarityCheckType: similarityType })}
                />
            </form>
        </>
    );
};

export default SubmissionsSimillarity;
