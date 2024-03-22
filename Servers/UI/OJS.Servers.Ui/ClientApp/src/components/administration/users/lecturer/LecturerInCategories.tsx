import { useEffect, useState } from 'react';
import { Autocomplete, FormControl, MenuItem, TextField, Typography } from '@mui/material';

import { SELECT_CATEGORY } from '../../../../common/labels';
import { IContestCategories, IGetAllAdminParams } from '../../../../common/types';
import { mapFilterParamsToQueryString } from '../../../../pages/administration-new/administration-filters/AdministrationFilters';
import { mapSorterParamsToQueryString } from '../../../../pages/administration-new/administration-sorting/AdministrationSorting';
import AdministrationGridView from '../../../../pages/administration-new/AdministrationGridView';
import lecturerInCategoriesFilterableColumns, { returnLecturerInCategoriesNonFilterableColumns } from '../../../../pages/administration-new/lecturers-in-categories/lecturersInCategoriesGridColumns';
import { setAdminUsersFilters, setAdminUsersSorters } from '../../../../redux/features/admin/usersAdminSlice';
import { useGetCategoriesQuery } from '../../../../redux/services/admin/contestCategoriesAdminService';
import { useAddLecturerToCategoryMutation, useGetLecturerCategoriesQuery, useRemoveLecturerFromCategoryMutation } from '../../../../redux/services/admin/usersAdminService';
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

interface ILecturerInCategoriesProps {
    userId: string;
}

const LecturerInCategories = (props: ILecturerInCategoriesProps) => {
    const { userId } = props;
    const filtersAndSortersLocation = `lecturer-in-categories${userId}`;

    const selectedFilters =
        useAppSelector((state) => state.adminUsers[filtersAndSortersLocation]?.selectedFilters) ?? [ ];
    const selectedSorters =
        useAppSelector((state) => state.adminUsers[filtersAndSortersLocation]?.selectedSorters) ?? [ ];

    const [ showConfirmDialog, setShowConfirmDialog ] = useState<boolean>(false);

    const [ categoryId, setCategoryId ] = useState<number>(0);
    const [ errorMessages, setErrorMessages ] = useState <Array<string>>([]);
    const [ successMessage, setSuccessMessage ] = useState <string | null>(null);
    const [ categoryToAdd, setCategoryToAdd ] = useState<number>(0);

    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: mapFilterParamsToQueryString(selectedFilters),
        sorting: mapSorterParamsToQueryString(selectedSorters),
    });

    const [ showCreateModal, setShowCreateModal ] = useState<boolean>(false);

    const {
        refetch,
        data,
        isLoading,
        error,
    } = useGetLecturerCategoriesQuery({ userId, ...queryParams });

    const [
        addLecturerToCategory,
        {
            data: addData,
            error: addError,
            isSuccess: isSuccessfullyAdded,
            isLoading: isAdding,
        },
    ] = useAddLecturerToCategoryMutation();

    const [
        removeLecturerFromCategory,
        {
            data: removeData,
            error: removeError,
            isSuccess: isSuccessfullyRemoved,
            isLoading: isRemoving,
        },
    ] = useRemoveLecturerFromCategoryMutation();

    const { data: contestCategories } = useGetCategoriesQuery(null);

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
        getAndSetExceptionMessage([ addError, removeError ], setErrorMessages);
        setSuccessMessage(null);
    }, [ addError, removeError ]);

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

    const onRemoveFromRowClicked = (uId: number) => {
        setCategoryId(uId);
        setShowConfirmDialog(true);
    };

    const onChange = (category: IContestCategories) => {
        setCategoryToAdd(category.id);
    };

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
                      sx={{ width: '100%' }}
                      className={formStyles.inputRow}
                      onChange={(event, newValue) => onChange(newValue!)}
                      options={contestCategories!}
                      renderInput={(params) => <TextField {...params} label={SELECT_CATEGORY} key={params.id} />}
                      getOptionLabel={(option) => option?.name}
                      renderOption={(properties, option) => (
                          <MenuItem {...properties} key={option.id} value={option.id}>
                              {option.name}
                          </MenuItem>
                      )}
                    />
                </FormControl>
                <FormActionButton
                  disabled={categoryToAdd === 0}
                  className={formStyles.buttonsWrapper}
                  buttonClassName={formStyles.button}
                  onClick={() => addLecturerToCategory({ lecturerId: userId, categoryId: categoryToAdd })}
                  name="Add"
                />
            </form>
        </AdministrationModal>
    );

    const renderConfirmDialog = (index: number) => (
        <ConfirmDialog
          key={index}
          text="Are you sure you want to remove lecturer from contest."
          title="Remove from role"
          declineButtonText="Close"
          confirmButtonText="Remove"
          declineFunction={() => setShowConfirmDialog(false)}
          confirmFunction={() => {
              removeLecturerFromCategory({ lecturerId: userId, categoryId });
              setShowConfirmDialog(false);
          }}
        />
    );

    const renderGridSettings = () => (
        <CreateButton
          showModal={showCreateModal}
          showModalFunc={setShowCreateModal}
          styles={{ width: '40px', height: '40px', color: 'rgb(25,118,210)' }}
          tooltipLabel="Add lecturer to category"
        />
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
              filterableGridColumnDef={lecturerInCategoriesFilterableColumns}
              setFilterStateAction={setAdminUsersFilters}
              setSorterStateAction={setAdminUsersSorters}
              renderActionButtons={renderGridSettings}
              notFilterableGridColumnDef={
            returnLecturerInCategoriesNonFilterableColumns(onRemoveFromRowClicked)
        }
              specificRowIdName="contestCategoryId"
              legendProps={[ { color: '#FFA1A1', message: 'Contest category is deleted.' } ]}
              modals={[
                  { showModal: showCreateModal, modal: (i) => renderCreateModal(i) },
                  { showModal: showConfirmDialog, modal: (i) => renderConfirmDialog(i) },
              ]}
            />
        </>
    );
};
export default LecturerInCategories;
