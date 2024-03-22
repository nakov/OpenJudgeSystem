import { useEffect, useState } from 'react';
import { Autocomplete, debounce, FormControl, MenuItem, TextField, Typography } from '@mui/material';

import { CONTEST_IS_DELETED, CONTEST_IS_NOT_VISIBLE } from '../../../../common/messages';
import { IContestAutocomplete, IGetAllAdminParams } from '../../../../common/types';
import { mapFilterParamsToQueryString } from '../../../../pages/administration-new/administration-filters/AdministrationFilters';
import { mapSorterParamsToQueryString } from '../../../../pages/administration-new/administration-sorting/AdministrationSorting';
import AdministrationGridView from '../../../../pages/administration-new/AdministrationGridView';
import lecturerInContestFilterableColumns, { returnLecturerInContestNonFilterableColumns } from '../../../../pages/administration-new/lecturers-in-contests/lecturersInContestsGridColumns';
import { setAdminUsersFilters, setAdminUsersSorters } from '../../../../redux/features/admin/usersAdminSlice';
import { useGetContestAutocompleteQuery } from '../../../../redux/services/admin/contestsAdminService';
import { useAddLecturerToContestMutation, useGetLecturerContestsQuery, useRemoveLecturerFromContestMutation } from '../../../../redux/services/admin/usersAdminService';
import { useAppSelector } from '../../../../redux/store';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../../utils/constants';
import { getAndSetExceptionMessage, getAndSetSuccesfullMessages } from '../../../../utils/messages-utils';
import { renderErrorMessagesAlert, renderSuccessfullAlert } from '../../../../utils/render-utils';
import ConfirmDialog from '../../../guidelines/dialog/ConfirmDialog';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';
import CreateButton from '../../common/create/CreateButton';
import AdministrationModal from '../../common/modals/administration-modal/AdministrationModal';
import FormActionButton from '../../form-action-button/FormActionButton';

// eslint-disable-next-line css-modules/no-unused-class
import formStyles from '../../common/styles/FormStyles.module.scss';

interface ILeturerInContestsProps {
    userId: string;
}
const LecturerInContests = (props: ILeturerInContestsProps) => {
    const { userId } = props;
    const filtersAndSortersLocation = `lecturer-in-contests${userId}`;

    const selectedFilters =
        useAppSelector((state) => state.adminUsers[filtersAndSortersLocation]?.selectedFilters) ?? [ ];
    const selectedSorters =
    useAppSelector((state) => state.adminUsers[filtersAndSortersLocation]?.selectedSorters) ?? [ ];
    const [ contestSearchString, setContestSearchString ] = useState<string>('');

    const [ contestId, setContestId ] = useState<number>(0);
    const [ showConfirmDialog, setShowConfirmDialog ] = useState<boolean>(false);
    const [ contestToAdd, setContestToAdd ] = useState<number>(0);

    const [ errorMessages, setErrorMessages ] = useState <Array<string>>([]);
    const [ successMessage, setSuccessMessage ] = useState <string | null>(null);

    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: mapFilterParamsToQueryString(selectedFilters),
        sorting: mapSorterParamsToQueryString(selectedSorters),
    });

    const [ contestAutocomplete, setContestsAutocomplete ] = useState<Array<IContestAutocomplete>>([
        {
            id: 0,
            name: '',
        },
    ]);

    const [ showCreateModal, setShowCreateModal ] = useState<boolean>(false);

    const {
        refetch,
        data,
        isLoading,
        error,
    } = useGetLecturerContestsQuery({ userId, ...queryParams });

    const [
        addLecturerToContest,
        {
            data: addData,
            error: addError,
            isSuccess: isSuccessfullyAdded,
            isLoading: isAdding,
        },
    ] = useAddLecturerToContestMutation();

    const {
        data: contestsAutocompleteData,
        error: getContestDataError,
    } = useGetContestAutocompleteQuery(contestSearchString);

    const [
        removeLecturerFromContest,
        {
            data: removeData,
            error: removeError,
            isSuccess: isSuccessfullyRemoved,
            isLoading: isRemoving,
        },
    ] = useRemoveLecturerFromContestMutation();

    const filtersQueryParams = mapFilterParamsToQueryString(selectedFilters);

    const sortersQueryParams = mapSorterParamsToQueryString(selectedSorters);

    useEffect(() => {
        setQueryParams((currentParams) => ({ ...currentParams, filter: filtersQueryParams }));
    }, [ filtersQueryParams ]);

    useEffect(() => {
        setQueryParams((currentParams) => ({ ...currentParams, sorting: sortersQueryParams }));
    }, [ sortersQueryParams ]);

    useEffect(() => {
        if (isSuccessfullyRemoved || isSuccessfullyAdded) {
            refetch();
        }
    }, [ isSuccessfullyAdded, isSuccessfullyRemoved, refetch ]);

    useEffect(() => {
        if (contestsAutocompleteData) {
            setContestsAutocomplete(contestsAutocompleteData);
        }
    }, [ contestsAutocompleteData ]);

    useEffect(() => {
        getAndSetExceptionMessage([ getContestDataError, addError, removeError ], setErrorMessages);
        setSuccessMessage(null);
    }, [ addError, getContestDataError, removeError ]);

    useEffect(() => {
        const message = getAndSetSuccesfullMessages([
            {
                message: addData,
                shouldGet: isSuccessfullyAdded,
            },
            {
                message: removeData,
                shouldGet: isSuccessfullyRemoved,
            } ]);

        setSuccessMessage(message);
    }, [ addData, isSuccessfullyAdded, isSuccessfullyRemoved, removeData ]);

    const onSelect = (contest: IContestAutocomplete) => {
        let currContestId = 0;
        if (contest) {
            currContestId = contest.id;
        }
        setContestToAdd(currContestId);
    };

    const onUserInputChange = debounce((e: any) => {
        setContestSearchString(e.target.value);
    }, 300);

    const onRemoveFromRowClicked = (uId: number) => {
        setContestId(uId);
        setShowConfirmDialog(true);
    };

    const renderConfirmDialog = (index: number) => (
        <ConfirmDialog
          key={index}
          text="Are you sure you want to remove lecturer from contest."
          title="Remove from role"
          declineButtonText="Close"
          confirmButtonText="Remove"
          declineFunction={() => setShowConfirmDialog(false)}
          confirmFunction={() => {
              removeLecturerFromContest({ lecturerId: userId, contestId });
              setShowConfirmDialog(false);
          }}
        />
    );

    const renderGridSettings = () => (
        <CreateButton
          showModal={showCreateModal}
          showModalFunc={setShowCreateModal}
          styles={{ width: '40px', height: '40px', color: 'rgb(25,118,210)' }}
          tooltipLabel="Add lecturer to contest"
        />
    );

    const renderCreateModal = (i: number) => (
        <AdministrationModal
          key={i}
          index={i}
          open={showCreateModal}
          onClose={() => {
              setShowCreateModal(false);
          }}
        >
            <form className={formStyles.form}>
                <Typography variant="h4" className="centralize">
                    Add lecturer to contest
                </Typography>
                <FormControl className={formStyles.inputRow}>
                    <Autocomplete
                      options={contestAutocomplete}
                      renderInput={(params) => <TextField {...params} label="Select User" key={params.id} />}
                      onChange={(event, newValue) => onSelect(newValue!)}
                      onInputChange={(event) => onUserInputChange(event)}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      getOptionLabel={(option) => option?.name}
                      renderOption={(properties, option) => (
                          <MenuItem {...properties} key={option.id} value={option.id}>
                              {option.name}
                          </MenuItem>
                      )}
                    />
                </FormControl>
                <FormActionButton
                  disabled={contestToAdd === 0}
                  className={formStyles.buttonsWrapper}
                  buttonClassName={formStyles.button}
                  onClick={() => addLecturerToContest({ lecturerId: userId, contestId: contestToAdd })}
                  name="Add"
                />
            </form>
        </AdministrationModal>
    );

    if (isLoading || isAdding || isRemoving) {
        return <SpinningLoader />;
    }

    return (
        <>
            {renderErrorMessagesAlert(errorMessages)}
            {renderSuccessfullAlert(successMessage)}
            <AdministrationGridView
              data={data}
              error={error}
              location={filtersAndSortersLocation}
              selectedFilters={selectedFilters}
              selectedSorters={selectedSorters}
              setQueryParams={setQueryParams}
              queryParams={queryParams}
              withSearchParams={false}
              filterableGridColumnDef={lecturerInContestFilterableColumns}
              setFilterStateAction={setAdminUsersFilters}
              setSorterStateAction={setAdminUsersSorters}
              renderActionButtons={renderGridSettings}
              notFilterableGridColumnDef={
            returnLecturerInContestNonFilterableColumns(onRemoveFromRowClicked)
        }
              specificRowIdName="contestId"
              legendProps={[ { color: '#FFA1A1', message: CONTEST_IS_DELETED }, { color: '#C0C0C0', message: CONTEST_IS_NOT_VISIBLE } ]}
              modals={[
                  { showModal: showCreateModal, modal: (i) => renderCreateModal(i) },
                  { showModal: showConfirmDialog, modal: (i) => renderConfirmDialog(i) },
              ]}
            />
        </>
    );
};
export default LecturerInContests;
