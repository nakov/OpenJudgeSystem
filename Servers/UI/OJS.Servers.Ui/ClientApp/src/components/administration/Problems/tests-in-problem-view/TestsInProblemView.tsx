/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Modal } from '@mui/material';

import { IGetAllAdminParams, IRootStore } from '../../../../common/types';
import { mapFilterParamsToQueryString } from '../../../../pages/administration-new/administration-filters/AdministrationFilters';
import { mapSorterParamsToQueryString } from '../../../../pages/administration-new/administration-sorting/AdministrationSorting';
import AdministrationGridView from '../../../../pages/administration-new/AdministrationGridView';
import testsFilterableColums, { returnTestsNonFilterableColumns } from '../../../../pages/administration-new/tests/testsGridColumns';
import { setAdminProblemsFilters, setAdminProblemsSorters } from '../../../../redux/features/admin/problemsAdminSlice';
import { useDeleteTestMutation, useGetTestsByProblemIdQuery } from '../../../../redux/services/admin/testsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../../utils/constants';
import { flexCenterObjectStyles, modalStyles } from '../../../../utils/object-utils';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';
import CreateButton from '../../common/create/CreateButton';
import TestForm from '../../tests/test-form/TestForm';

interface ITestsInProblemsViewProps {
    problemId: number;
}
const TestsInProblemView = (props: ITestsInProblemsViewProps) => {
    const { problemId } = props;
    const filtersAndSortersLocation = `problem-details-tests-${problemId}`;

    const [ testId, setTestId ] = useState<number | null>(null);
    const [ openEditTestModal, setOpenEditTestModal ] = useState(false);
    const [ openCreateModal, setOpenCreateModal ] = useState(false);


    const selectedFilters =
    useSelector((state: IRootStore) => state.adminProblems[filtersAndSortersLocation]?.selectedFilters) ?? [ ];
    const selectedSorters =
    useSelector((state: IRootStore) => state.adminProblems[filtersAndSortersLocation]?.selectedSorters) ?? [ ];

    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        ItemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: mapFilterParamsToQueryString(selectedFilters),
        sorting: mapSorterParamsToQueryString(selectedSorters),
    });

    const {
        data: testsData,
        error,
        isLoading: isGettingData,
    } = useGetTestsByProblemIdQuery({ problemId, ...queryParams });

    const filtersQueryParams = mapFilterParamsToQueryString(selectedFilters);

    const sortersQueryParams = mapSorterParamsToQueryString(selectedSorters);

    useEffect(() => {
        setQueryParams({ ...queryParams, filter: filtersQueryParams });
    }, [ filtersQueryParams ]);

    useEffect(() => {
        setQueryParams({ ...queryParams, sorting: sortersQueryParams });
    }, [ sortersQueryParams ]);

    const onEditClick = (id: number) => {
        setOpenEditTestModal(true);
        setTestId(id);
    };

    const onCreateClick = () => {

    };

    const renderGridSettings = () => (
        <div>
            <CreateButton />
        </div>
    );

    const renderModal = (index: number, isEditMode: boolean) => (
        <Modal
          key={index}
          open={openEditTestModal}
          onClose={() => setOpenEditTestModal(false)}
        >
            <Box sx={modalStyles}>
                <TestForm
                  id={isEditMode
                      ? testId!
                      : 0}
                  isEditMode={isEditMode}
                />
            </Box>
        </Modal>
    );

    if (isGettingData) {
        return <div style={{ ...flexCenterObjectStyles }}><SpinningLoader /></div>;
    }

    return (
        <AdministrationGridView
          filterableGridColumnDef={testsFilterableColums}
          notFilterableGridColumnDef={
                returnTestsNonFilterableColumns(
                    onEditClick,
                    useDeleteTestMutation,
                )
}
          data={testsData}
          renderActionButtons={renderGridSettings}
          error={error}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          selectedFilters={selectedFilters || []}
          selectedSorters={selectedSorters || []}
          setFilterStateAction={setAdminProblemsFilters}
          setSorterStateAction={setAdminProblemsSorters}
          location={filtersAndSortersLocation}
          withSearchParams={false}
          modals={[
              { showModal: openCreateModal, modal: (i) => renderModal(i, false) },
              { showModal: openEditTestModal, modal: (i) => renderModal(i, true) },
          ]}
        />
    );
};
export default TestsInProblemView;
