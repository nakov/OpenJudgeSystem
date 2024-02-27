import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Box, Modal } from '@mui/material';

import { IGetAllAdminParams, IRootStore } from '../../../common/types';
import CopyModal, { AllowedOperations } from '../../../components/administration/Problems/copy-modal/CopyModal';
import ProblemForm from '../../../components/administration/Problems/problemForm/ProblemForm';
import ProblemRetest from '../../../components/administration/Problems/retest/ProblemRetest';
import { AlertSeverity } from '../../../components/guidelines/alert/Alert';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import { setAdminProblemsFilters, setAdminProblemsSorters } from '../../../redux/features/admin/problemsAdminSlice';
import { useDeleteProblemMutation, useGetAllAdminProblemsQuery } from '../../../redux/services/admin/problemsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import { flexCenterObjectStyles, modalStyles } from '../../../utils/object-utils';
import { renderAlert } from '../../../utils/render-utils';
import AdministrationGridView from '../AdministrationGridView';

import filterableColumns, { returnProblemsNonFilterableColumns } from './problemGridColumns';

const AdministrationProblemsPage = () => {
    const [ searchParams ] = useSearchParams();
    const [ openEditProblemModal, setOpenEditProblemModal ] = useState(false);
    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        ItemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: searchParams.get('filter') ?? '',
        sorting: searchParams.get('sorting') ?? '',
    });
    const [ problemId, setProblemId ] = useState<number | null>(null);
    const [ showRetestModal, setShowRetestModal ] = useState<boolean>(false);
    const [ successMessage, setSuccessMessage ] = useState <string | null>(null);
    const [ showCopyModal, setShowCopyModal ] = useState<boolean>(false);
    const selectedFilters = useSelector((state: IRootStore) => state.adminProblems['all-problems']?.selectedFilters);
    const selectedSorters = useSelector((state: IRootStore) => state.adminProblems['all-problems']?.selectedSorters);
    const { refetch: retakeProblems, data: problemsData, isLoading: isLoadingProblems, error } = useGetAllAdminProblemsQuery(queryParams);

    const filterParams = searchParams.get('filter');
    const sortingParams = searchParams.get('sorting');

    useEffect(() => {
        setQueryParams((currentParams) => ({ ...currentParams, filter: filterParams ?? '' }));
    }, [ filterParams ]);

    useEffect(() => {
        setQueryParams((currentParams) => ({ ...currentParams, sorting: sortingParams ?? '' }));
    }, [ sortingParams ]);

    const onEditClick = (id: number) => {
        setOpenEditProblemModal(true);
        setProblemId(id);
    };

    const openRetestModal = (id: number) => {
        setShowRetestModal(true);
        setProblemId(id);
    };

    const onSuccessOperation = (message: string) => {
        setSuccessMessage(message);
        setShowRetestModal(false);
    };

    const openCopyModal = (id: number) => {
        setShowCopyModal(true);
        setProblemId(id);
    };

    const renderRetestModal = (index: number) => (
        <ProblemRetest
          key={index}
          contestId={problemsData?.items?.find((x) => x.id === problemId)?.contestId || 0}
          declineFunction={() => setShowRetestModal(!showRetestModal)}
          index={index}
          problemData={problemsData}
          problemName={problemsData?.items
              ? problemsData?.items.find((x) => x.id === problemId)?.name
              : 'problem'}
          problemToRetest={problemId!}
          onSuccess={onSuccessOperation}
        />
    );

    const renderProblemsEditModal = (index: number) => (
        <Modal
          key={index}
          open={openEditProblemModal}
          onClose={() => setOpenEditProblemModal(false)}
        >
            <Box sx={modalStyles}>
                <ProblemForm problemId={Number(problemId)} isEditMode contestId={null} />
            </Box>
        </Modal>
    );

    const renderCopyModal = (index: number) => (
        <CopyModal
          key={index}
          index={index}
          operation={AllowedOperations.Copy}
          setShowModal={setShowCopyModal}
          sourceId={problemsData?.items?.find((x) => x.id === problemId)?.contestId || 0}
          sourceName={problemsData?.items
              ? problemsData?.items[0].contest
              : ''}
          problemToCopy={problemId}
          onSuccess={onSuccessOperation}
        />
    );

    if (isLoadingProblems) {
        return <div style={{ ...flexCenterObjectStyles }}><SpinningLoader /></div>;
    }

    return (
        <>
            {successMessage && renderAlert(successMessage, AlertSeverity.Success, 0, 3000)}
            <AdministrationGridView
              filterableGridColumnDef={filterableColumns}
              notFilterableGridColumnDef={
                returnProblemsNonFilterableColumns(
                    onEditClick,
                    useDeleteProblemMutation,
                    openCopyModal,
                    openRetestModal,
                    retakeProblems,
                )
}
              data={problemsData}
              error={error}
              queryParams={queryParams}
              setQueryParams={setQueryParams}
              selectedFilters={selectedFilters || []}
              selectedSorters={selectedSorters || []}
              setFilterStateAction={setAdminProblemsFilters}
              setSorterStateAction={setAdminProblemsSorters}
              location="all-problems"
              modals={[
                  { showModal: openEditProblemModal, modal: (i) => renderProblemsEditModal(i) },
                  { showModal: showRetestModal, modal: (i) => renderRetestModal(i) },
                  { showModal: showCopyModal, modal: (i) => renderCopyModal(i) },
              ]}
              legendProps={[ { color: '#FFA1A1', message: 'Problem is deleted.' } ]}
            />
        </>
    );
};

export default AdministrationProblemsPage;
