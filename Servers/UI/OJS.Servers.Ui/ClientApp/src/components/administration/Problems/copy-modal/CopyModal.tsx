/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/ban-types */
import React, { useEffect, useState } from 'react';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { Autocomplete, Box, Button, debounce, MenuItem, Modal, TextField, Typography } from '@mui/material';

import { IContestAutocomplete, IIndexProblemsType, IPagedResultType } from '../../../../common/types';
import { getAndSetExceptionMessage, getAndSetSuccesfullMessages } from '../../../../utils/messages-utils';
import { modalStyles } from '../../../../utils/object-utils';
import { renderAlert } from '../../../../utils/render-utils';
import { AlertSeverity } from '../../../guidelines/alert/Alert';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';

interface ICopyModalProps{
key? :number;
showModal: boolean;
setShowModal: Function;
getDataQuery: any;
skipRequest: boolean;
data: IPagedResultType<IIndexProblemsType>;
postMutation: any;
sourceId: number;

}
const CopyModal = (props: ICopyModalProps) => {
    const { key, showModal, setShowModal, data, skipRequest, getDataQuery, postMutation, sourceId } = props;
    const [ destination, setDestination ] = useState<IContestAutocomplete| null>(null);
    const [ contestSearchString, setContestSearchString ] = useState<string>('');
    const [ problemsCopyAllData, setContestsAutocomplete ] = useState <Array<IContestAutocomplete>>([]);
    const { data: autocompleteData, isLoading, error } = getDataQuery(contestSearchString, { skip: skipRequest });
    const [ post, { data: responseData, isLoading: isPosting, error: postError } ] = postMutation();
    const [ successMessage, setSuccessMessage ] = useState<string | null>(null);
    const [ errorMessages, setErrorMessages ] = useState<Array<string>>([]);

    useEffect(() => {
        const message = getAndSetSuccesfullMessages([ responseData ]);
        setSuccessMessage(message);
    }, [ responseData ]);

    useEffect(() => {
        getAndSetExceptionMessage([ error, postError ], setErrorMessages);
    }, [ error, postError ]);

    useEffect(() => {
        if (autocompleteData) {
            setContestsAutocomplete(autocompleteData);
        }
    }, [ autocompleteData ]);

    const onCopyAllSelect = (contest: IContestAutocomplete) => {
        setDestination(contest);
    };

    const onCopyAllChange = debounce((e: any) => {
        setContestSearchString(e.target.value);
    }, 300);

    const onCopy = () => {
        post({ sourceContestId: sourceId, destinationContestId: destination!.id });
    };

    if (isPosting) {
        return <SpinningLoader />;
    }

    return (
        <Modal
          key={key}
          open={showModal && data!.totalItemsCount > 0}
          onClose={() => setShowModal(!showModal)}
        >
            <Box sx={modalStyles}>
                {isLoading
                    ? <SpinningLoader />
                    : (
                        <>
                            {successMessage && renderAlert(successMessage, AlertSeverity.Success, 0, 3000)}
                            {errorMessages.map((x: string, i:number) => renderAlert(x, AlertSeverity.Error, i))}
                            <Typography variant="h5" padding="0.5rem">Copy Problems</Typography>
                            <Autocomplete
                              options={problemsCopyAllData!}
                              renderInput={(params) => <TextField {...params} label="Select Contest" key={params.id} />}
                              onChange={(event, newValue) => onCopyAllSelect(newValue!)}
                              onInputChange={(event) => onCopyAllChange(event)}
                              value={null}
                              isOptionEqualToValue={(option, value) => option.id === value.id}
                              getOptionLabel={(option) => option?.name}
                              renderOption={(properties, option) => (
                                  <MenuItem {...properties} key={option.id} value={option.id}>
                                      {option.name}
                                  </MenuItem>
                              )}
                            />
                            {destination !== null && (
                            <Box sx={{ padding: '4rem' }}>
                                <Typography sx={{ display: 'flex', justifyContent: 'space-around' }}>
                                    {data?.items![0].contest}
                                    {' '}
                                    <FaLongArrowAltRight />
                                    {destination?.name}
                                </Typography>
                            </Box>
                            )}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <Button variant="contained" disabled={destination === null} onClick={onCopy}>Copy</Button>
                            </Box>
                        </>
                    )}
            </Box>
        </Modal>
    );
};
export default CopyModal;
