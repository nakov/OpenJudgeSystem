import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { IGetAllAdminParams } from '../../../common/types';
import AdministrationModal from '../../../components/administration/common/modals/administration-modal/AdministrationModal';
import CopyModal, { AllowedOperations } from '../../../components/administration/Problems/copy-modal/CopyModal';
import ProblemForm from '../../../components/administration/Problems/problemForm/ProblemForm';
import ProblemRetest from '../../../components/administration/Problems/retest/ProblemRetest';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import { useDeleteProblemMutation, useGetAllAdminProblemsQuery, useLazyExportProblemsToExcelQuery } from '../../../redux/services/admin/problemsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import { flexCenterObjectStyles } from '../../../utils/object-utils';
import { renderSuccessfullAlert } from '../../../utils/render-utils';
import { applyDefaultFilterToQueryString, IAdministrationFilter, mapGridColumnsToAdministrationFilterProps, mapUrlToFilters } from '../administration-filters/AdministrationFilters';
import { IAdministrationSorter, mapGridColumnsToAdministrationSortingProps, mapUrlToSorters } from '../administration-sorting/AdministrationSorting';
import AdministrationGridView from '../AdministrationGridView';

import filterableColumns, { returnProblemsNonFilterableColumns } from './problemGridColumns';

const AdministrationProblemsPage = () => {
    const [ searchParams ] = useSearchParams();
    const [ openEditProblemModal, setOpenEditProblemModal ] = useState(false);
    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: applyDefaultFilterToQueryString(searchParams, filterableColumns),
        sorting: searchParams.get('sorting') ?? '',
    });
    const [ problemId, setProblemId ] = useState<number | null>(null);
    const [ showRetestModal, setShowRetestModal ] = useState<boolean>(false);
    const [ successMessage, setSuccessMessage ] = useState <string | null>(null);
    const [ showCopyModal, setShowCopyModal ] = useState<boolean>(false);

    const [ selectedFilters, setSelectedFilters ] = useState<Array<IAdministrationFilter>>(mapUrlToFilters(
        searchParams ?? '',
        mapGridColumnsToAdministrationFilterProps(filterableColumns),
    ));

    const [ selectedSorters, setSelectedSorters ] = useState<Array<IAdministrationSorter>>(mapUrlToSorters(
        searchParams ?? '',
        mapGridColumnsToAdministrationSortingProps(filterableColumns),
    ));

    const { refetch: retakeProblems, data: problemsData, isLoading: isLoadingProblems, error } = useGetAllAdminProblemsQuery(queryParams);

    useEffect(() => {
        setQueryParams((currentParams) => ({
            ...currentParams,
            filter: applyDefaultFilterToQueryString(searchParams, filterableColumns),
            sorting: searchParams.get('sorting') ?? '',
        }));
    }, [ searchParams ]);

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

    const onEditModalClose = () => {
        setOpenEditProblemModal(false);
        retakeProblems();
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
        <AdministrationModal
          index={index}
          open={openEditProblemModal}
          onClose={() => onEditModalClose()}
        >
            <ProblemForm problemId={Number(problemId)} isEditMode contestId={null} />
        </AdministrationModal>
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
            {renderSuccessfullAlert(successMessage)}
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
              setSorterStateAction={setSelectedSorters}
              setFilterStateAction={setSelectedFilters}
              modals={[
                  { showModal: openEditProblemModal, modal: (i) => renderProblemsEditModal(i) },
                  { showModal: showRetestModal, modal: (i) => renderRetestModal(i) },
                  { showModal: showCopyModal, modal: (i) => renderCopyModal(i) },
              ]}
              legendProps={[ { color: '#FFA1A1', message: 'Problem is deleted.' } ]}
              excelMutation={useLazyExportProblemsToExcelQuery}
            />
        </>
    );
};

export default AdministrationProblemsPage;
