import React, { useEffect, useState } from 'react';
import { MdCopyAll, MdDeleteForever } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { IconButton, Tooltip } from '@mui/material';

import { ContestVariation } from '../../../../common/contest-types';
import { IGetAllAdminParams, IRootStore } from '../../../../common/types';
import { mapFilterParamsToQueryString } from '../../../../pages/administration-new/administration-filters/AdministrationFilters';
import { mapSorterParamsToQueryString } from '../../../../pages/administration-new/administration-sorting/AdministrationSorting';
import AdministrationGridView from '../../../../pages/administration-new/AdministrationGridView';
import problemFilterableColums, { returnProblemsNonFilterableColumns } from '../../../../pages/administration-new/problems/problemGridColumns';
import { setAdminContestsFilters, setAdminContestsSorters } from '../../../../redux/features/admin/contestsAdminSlice';
import { useDeleteByContestMutation, useDeleteProblemMutation, useGetContestProblemsQuery } from '../../../../redux/services/admin/problemsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../../utils/constants';
import { getAndSetExceptionMessage, getAndSetSuccesfullMessages } from '../../../../utils/messages-utils';
import { renderErrorMessagesAlert, renderSuccessfullAlert } from '../../../../utils/render-utils';
import ConfirmDialog from '../../../guidelines/dialog/ConfirmDialog';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';
import CreateButton from '../../common/create/CreateButton';
import AdministrationModal from '../../common/modals/administration-modal/AdministrationModal';
import CopyModal, { AllowedOperations } from '../../Problems/copy-modal/CopyModal';
import ProblemForm from '../../Problems/problemForm/ProblemForm';
import ProblemRetest from '../../Problems/retest/ProblemRetest';

interface IProblemsInContestViewProps {
    contestId: number;
    contestType: ContestVariation | undefined;
}

const ProblemsInContestView = (props:IProblemsInContestViewProps) => {
    const { contestId, contestType } = props;
    const filtersAndSortersLocation = `contest-details-problems-${contestId}`;

    const selectedFilters =
        useSelector((state: IRootStore) => state.adminContests[filtersAndSortersLocation]?.selectedFilters) ?? [ ];
    const selectedSorters =
        useSelector((state: IRootStore) => state.adminContests[filtersAndSortersLocation]?.selectedSorters) ?? [ ];

    const [ openEditModal, setOpenEditModal ] = useState<boolean>(false);
    const [ problemId, setProblemId ] = useState<number>(-1);
    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: mapFilterParamsToQueryString(selectedFilters),
        sorting: mapSorterParamsToQueryString(selectedSorters),
    });

    const [ errorMessages, setErrorMessages ] = useState <Array<string>>([]);
    const [ successMessage, setSuccessMessage ] = useState <string | null>(null);

    const [ showDeleteAllConfirm, setShowDeleteAllConfirm ] = useState<boolean>(false);
    const [ showRetestModal, setShowRetestModal ] = useState<boolean>(false);
    const [ problemToRetestId, setProblemToRetestId ] = useState<number>(0);
    const [ openShowCreateProblemModal, setOpenShowCreateProblemModal ] = useState<boolean>(false);
    const [ showCopyAllModal, setShowCopyAllModal ] = useState<boolean>(false);
    const [ showCopyModal, setShowCopyModal ] = useState<boolean>(false);
    const [ problemToCopy, setProblemToCopy ] = useState<number>(0);

    const {
        refetch: retakeData,
        data: problemsData,
        error: getContestError,
    } = useGetContestProblemsQuery({ contestId: Number(contestId), ...queryParams });

    const [ deleteByContest,
        {
            data: deleteAllData,
            isSuccess: isSuccesfullyDeletedAll,
            isLoading: isDeletingAll,
            error: deleteAllError,
        } ] = useDeleteByContestMutation();

    const filtersQueryParams = mapFilterParamsToQueryString(selectedFilters);

    const sortersQueryParams = mapSorterParamsToQueryString(selectedSorters);

    useEffect(() => {
        getAndSetExceptionMessage([ deleteAllError, getContestError ], setErrorMessages);
        setSuccessMessage(null);
    }, [ deleteAllError, getContestError ]);

    useEffect(() => {
        const message = getAndSetSuccesfullMessages([
            {
                message: deleteAllData,
                shouldGet: isSuccesfullyDeletedAll,
            } ]);

        setSuccessMessage(message);
    }, [ deleteAllData, isSuccesfullyDeletedAll ]);

    useEffect(() => {
        setQueryParams((currentParams) => ({ ...currentParams, filter: filtersQueryParams }));
    }, [ filtersQueryParams ]);

    useEffect(() => {
        setQueryParams((currentParams) => ({ ...currentParams, sorting: sortersQueryParams }));
    }, [ sortersQueryParams ]);

    const onEditClick = (id: number) => {
        setOpenEditModal(true);
        setProblemId(id);
    };

    useEffect(() => {
        if (isSuccesfullyDeletedAll) {
            retakeData();
        }
    }, [ isSuccesfullyDeletedAll, retakeData ]);

    const onCopySuccess = (message: string | null) => {
        setSuccessMessage(message);
    };

    const openCopyModal = (id: number) => {
        setShowCopyModal(true);
        setProblemToCopy(id);
    };

    const openRetestModal = (id: number) => {
        setShowRetestModal(true);
        setProblemToRetestId(id);
    };

    const renderProblemModal = (index: number, isCreate: boolean) => (
        <AdministrationModal
          index={index}
          open={isCreate
              ? openShowCreateProblemModal
              : openEditModal}
          onClose={() => isCreate
              ? setOpenShowCreateProblemModal(!openShowCreateProblemModal)
              : setOpenEditModal(false)}
        >
            {isCreate
                ? (
                    <ProblemForm
                      contestId={Number(contestId)}
                      problemId={null}
                      isEditMode={false}
                      contestType={contestType!}
                    />
                )
                : (
                    <ProblemForm
                      problemId={problemId}
                      contestType={null}
                    />
                )}
        </AdministrationModal>
    );

    const renderDeleteAllModal = (index: number) => (
        <ConfirmDialog
          key={index}
          text={`Are you sure you want to delete all problems ${problemsData?.items
              ? problemsData?.items[0].contest
              : ''}`}
          title="Delete All Problems"
          declineButtonText="Close"
          confirmButtonText="Delete"
          declineFunction={() => setShowDeleteAllConfirm(!showDeleteAllConfirm)}
          confirmFunction={() => {
              deleteByContest(contestId);
              setShowDeleteAllConfirm(!showDeleteAllConfirm);
          }}
        />
    );

    const onSuccesfullRetest = (message: string) => {
        setSuccessMessage(message);
        setShowRetestModal(false);
    };
    const renderRetestModal = (index: number) => (
        <ProblemRetest
          key={index}
          contestId={contestId}
          declineFunction={() => setShowRetestModal(!showRetestModal)}
          index={index}
          problemData={problemsData}
          problemName={problemsData?.items
              ? problemsData?.items.find((x) => x.id === problemToRetestId)?.name
              : 'problem'}
          problemToRetest={problemToRetestId}
          onSuccess={onSuccesfullRetest}
        />
    );

    const renderGridSettings = () => (
        <>
            <CreateButton
              showModal={openShowCreateProblemModal}
              showModalFunc={setOpenShowCreateProblemModal}
              styles={{ width: '40px', height: '40px', color: 'rgb(25,118,210)' }}
            />
            <Tooltip title="Copy All">
                <IconButton onClick={() => {
                    setShowCopyAllModal(!showCopyAllModal);
                }}
                >
                    <MdCopyAll style={{ width: '40px', height: '40px', color: 'rgb(25,118,210)' }} color="primary" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Delete All">
                <IconButton onClick={() => setShowDeleteAllConfirm(!showDeleteAllConfirm)}>
                    <MdDeleteForever style={{ width: '40px', height: '40px', color: 'red' }} />
                </IconButton>
            </Tooltip>
        </>
    );

    const renderCopyModal = (index: number, operation: AllowedOperations) => (
        <CopyModal
          key={index + operation}
          index={index}
          operation={operation}
          setShowModal={operation === AllowedOperations.Copy
              ? setShowCopyModal
              : setShowCopyAllModal}
          sourceId={contestId}
          sourceName={problemsData?.items
              ? problemsData?.items[0].contest
              : ''}
          problemToCopy={problemToCopy}
          onSuccess={onCopySuccess}
        />
    );

    return (
        <div style={{ marginTop: '2rem' }}>
            {renderErrorMessagesAlert(errorMessages)}
            {renderSuccessfullAlert(successMessage)}
            { isDeletingAll
                ? <SpinningLoader />
                : (
                    <AdministrationGridView
                      data={problemsData}
                      error={getContestError}
                      filterableGridColumnDef={problemFilterableColums}
                      notFilterableGridColumnDef={
                        returnProblemsNonFilterableColumns(
                            onEditClick,
                            useDeleteProblemMutation,
                            openCopyModal,
                            openRetestModal,
                            retakeData,
                        )
}
                      queryParams={queryParams}
                      location={filtersAndSortersLocation}
                      selectedFilters={selectedFilters}
                      selectedSorters={selectedSorters}
                      setQueryParams={setQueryParams}
                      modals={[
                          { showModal: openEditModal, modal: (i) => renderProblemModal(i, false) },
                          { showModal: openShowCreateProblemModal, modal: (i) => renderProblemModal(i, true) },
                          { showModal: showDeleteAllConfirm, modal: (i) => renderDeleteAllModal(i) },
                          {
                              showModal: showCopyAllModal,
                              modal: (i) => renderCopyModal(i, AllowedOperations.CopyAll),
                          },
                          {
                              showModal: showCopyModal,
                              modal: (i) => renderCopyModal(i, AllowedOperations.Copy),
                          },
                          {
                              showModal: showRetestModal,
                              modal: (i) => renderRetestModal(i),
                          },
                      ]}
                      renderActionButtons={renderGridSettings}
                      setFilterStateAction={setAdminContestsFilters}
                      setSorterStateAction={setAdminContestsSorters}
                      withSearchParams={false}
                      legendProps={[ { color: '#FFA1A1', message: 'Problem is deleted.' } ]}
                    />
                )}
        </div>
    );
};

export default ProblemsInContestView;
