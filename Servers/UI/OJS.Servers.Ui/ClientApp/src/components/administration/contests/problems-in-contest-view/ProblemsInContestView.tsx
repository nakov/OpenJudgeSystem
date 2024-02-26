/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { MdCopyAll, MdDeleteForever } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { Box, IconButton, Modal, Tooltip } from '@mui/material';

import { IGetAllAdminParams, IRootStore } from '../../../../common/types';
import { mapFilterParamsToQueryString } from '../../../../pages/administration-new/administration-filters/AdministrationFilters';
import { mapSorterParamsToQueryString } from '../../../../pages/administration-new/administration-sorting/AdministrationSorting';
import AdministrationGridView from '../../../../pages/administration-new/AdministrationGridView';
import problemFilterableColums, { returnProblemsNonFilterableColumns } from '../../../../pages/administration-new/problems/problemGridColumns';
import { setAdminContestsFilters, setAdminContestsSorters } from '../../../../redux/features/admin/contestsAdminSlice';
import { useDeleteByContestMutation, useDeleteProblemMutation, useGetContestProblemsQuery, useRetestByIdMutation } from '../../../../redux/services/admin/problemsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../../utils/constants';
import { getAndSetExceptionMessage, getAndSetSuccesfullMessages } from '../../../../utils/messages-utils';
import { flexCenterObjectStyles, modalStyles } from '../../../../utils/object-utils';
import { renderAlert } from '../../../../utils/render-utils';
import { AlertSeverity } from '../../../guidelines/alert/Alert';
import ConfirmDialog from '../../../guidelines/dialog/ConfirmDialog';
import ConfirmDialogWithAdditionalProtection from '../../../guidelines/dialog/dialog-with-additional-protection/ConfirmDialogWithAdditionalProtection';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';
import CreateButton from '../../common/create/CreateButton';
import CopyModal, { AllowedOperations } from '../../Problems/copy-modal/CopyModal';
import ProblemForm from '../../Problems/problemForm/ProblemForm';

interface IProblemsInContestViewProps {
    contestId: number;
}

const ProblemsInContestView = (props:IProblemsInContestViewProps) => {
    const { contestId } = props;
    const filtersAndSortersLocation = `contest-details-problems-${contestId}`;

    const selectedFilters =
        useSelector((state: IRootStore) => state.adminContests[filtersAndSortersLocation]?.selectedFilters) ?? [ ];
    const selectedSorters =
        useSelector((state: IRootStore) => state.adminContests[filtersAndSortersLocation]?.selectedSorters) ?? [ ];

    const [ openEditModal, setOpenEditModal ] = useState<boolean>(false);
    const [ problemId, setProblemId ] = useState<number>(-1);
    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        ItemsPerPage: DEFAULT_ITEMS_PER_PAGE,
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

    const [ retestById,
        {
            data: retestData,
            isSuccess: isSuccesfullyRetested,
            isLoading: isRetesting,
            error: retestError,
        } ] = useRetestByIdMutation();

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
        getAndSetExceptionMessage([ deleteAllError, retestError, getContestError ], setErrorMessages);
        setSuccessMessage(null);
    }, [ deleteAllError, retestError, getContestError ]);

    useEffect(() => {
        const message = getAndSetSuccesfullMessages([
            {
                message: deleteAllData,
                shouldGet: isSuccesfullyDeletedAll,
            },
            { message: retestData, shouldGet: isSuccesfullyRetested } ]);

        setSuccessMessage(message);
    }, [ isSuccesfullyRetested, isSuccesfullyDeletedAll ]);

    useEffect(() => {
        setQueryParams({ ...queryParams, filter: filtersQueryParams });
    }, [ filtersQueryParams ]);

    useEffect(() => {
        setQueryParams({ ...queryParams, sorting: sortersQueryParams });
    }, [ sortersQueryParams ]);

    const onEditClick = (id: number) => {
        setOpenEditModal(true);
        setProblemId(id);
    };

    useEffect(() => {
        if (isSuccesfullyDeletedAll) {
            retakeData();
        }
    }, [ isSuccesfullyDeletedAll ]);

    const retestProblem = (currentProblemId: number) => {
        const currentProblem = problemsData?.items?.find((x) => x.id === currentProblemId);
        if (currentProblem) {
            const problem = {
                id: currentProblemId,
                name: currentProblem.name,
                contestName: currentProblem.contest,
                contestId,
            };
            retestById(problem);
        }
    };

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
        <Modal
          key={index}
          open={isCreate
              ? openShowCreateProblemModal
              : openEditModal}
          onClose={() => isCreate
              ? setOpenShowCreateProblemModal(!openShowCreateProblemModal)
              : setOpenEditModal(false)}
        >
            <Box sx={modalStyles}>
                <ProblemForm
                  contestId={Number(contestId)}
                  problemId={isCreate
                      ? null
                      : problemId}
                  isEditMode={!isCreate}
                />
            </Box>
        </Modal>
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

    const renderRetestModal = (index: number) => (
        <ConfirmDialogWithAdditionalProtection
          key={index}
          text={`Are you sure you want to retest all submissions for  ${problemsData?.items
              ? problemsData?.items.find((x) => x.id === problemToRetestId)?.name
              : ''}`}
          title="Retest"
          passWordToMatch="Retest"
          confirmButtonText="Retest"
          declineFunction={() => setShowRetestModal(!showRetestModal)}
          confirmFunction={() => {
              retestProblem(problemToRetestId);
              setShowRetestModal(!showRetestModal);
          }}
        />
    );

    const renderGridSettings = () => (
        <div style={{ ...flexCenterObjectStyles, justifyContent: 'space-between' }}>
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
        </div>
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
            {successMessage && renderAlert(successMessage, AlertSeverity.Success, 0, 3000)}
            {errorMessages.map((x: string, i:number) => renderAlert(x, AlertSeverity.Error, i))}
            {isRetesting || isDeletingAll
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
