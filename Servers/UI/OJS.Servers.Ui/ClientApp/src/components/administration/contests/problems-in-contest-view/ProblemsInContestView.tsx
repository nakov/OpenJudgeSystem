/* eslint-disable no-undefined */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { MdCopyAll, MdDeleteForever } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { Autocomplete, Box, Button, IconButton, MenuItem, Modal, TextField, Tooltip, Typography } from '@mui/material';
import debounce from 'lodash/debounce';

import { IContestAutocomplete, IGetAllAdminParams, IRootStore } from '../../../../common/types';
import { mapFilterParamsToQueryString } from '../../../../pages/administration-new/administration-filters/AdministrationFilters';
import { mapSorterParamsToQueryString } from '../../../../pages/administration-new/administration-sorting/AdministrationSorting';
import AdministrationGridView from '../../../../pages/administration-new/AdministrationGridView';
import problemFilterableColums, { returnProblemsNonFilterableColumns } from '../../../../pages/administration-new/problems/problemGridColumns';
import { setAdminContestsFilters, setAdminContestsSorters } from '../../../../redux/features/admin/contestsAdminSlice';
import { useGetCopyAllQuery } from '../../../../redux/services/admin/contestsAdminService';
import { useCopyAllMutation, useCopyMutation, useDeleteByContestMutation, useDeleteProblemMutation, useGetContestProblemsQuery, useRetestByIdMutation } from '../../../../redux/services/admin/problemsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../../utils/constants';
import { getAndSetExceptionMessage, getAndSetSuccesfullMessages } from '../../../../utils/messages-utils';
import { flexCenterObjectStyles, modalStyles } from '../../../../utils/object-utils';
import { renderAlert } from '../../../../utils/render-utils';
import { AlertSeverity } from '../../../guidelines/alert/Alert';
import ConfirmDialog from '../../../guidelines/dialog/ConfirmDialog';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';
import CreateButton from '../../common/create/CreateButton';
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
    const [ problemsCopyAllData, setContestsAutocomplete ] = useState <Array<IContestAutocomplete>>([]);

    const [ showDeleteAllConfirm, setShowDeleteAllConfirm ] = useState<boolean>(false);

    const [ problemToCopy, setProblemToCopy ] = useState<number | undefined>(undefined);
    const [newProblemGroup, setNewProblemGroup] = useState<number | undefined>(undefined); 
    const [ openShowCreateProblemModal, setOpenShowCreateProblemModal ] = useState<boolean>(false);
    const [ skipContestAutocomplete, setSkipContestAutocomplete ] = useState<boolean>(true);
    const [ showCopyAllModal, setShowCopyAllModal ] = useState<boolean>(false);
    const [ showCopyModal, setShowCopyModal ] = useState<boolean>(false);
    const [ contestToCopy, setContestToCopy ] = useState<IContestAutocomplete| null>(null);
    const [ contestSearchString, setContestSearchString ] = useState<string>('');
    const {
        refetch: retakeData,
        data: problemsData,
        error: getContestError,
    } = useGetContestProblemsQuery({ contestId: Number(contestId), ...queryParams });

    const { data: contestsAutocompleteData } = useGetCopyAllQuery(contestSearchString, { skip: skipContestAutocomplete });

    const [ copyAll,
        {
            data: copyAllData,
            isSuccess: isSuccesfullyCoppiedAll,
            isLoading: isCoppyingAll,
            error: copyAllError,
        } ] =
        useCopyAllMutation();

    const [ copy,
        {
            data: copyData,
            isSuccess: isSuccesfullyCoppied,
            isLoading: isCoppying,
            error: copyError,
        } ] =
            useCopyMutation();

    const [ retestById,
        {
            data: retestData,
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
        getAndSetExceptionMessage([ deleteAllError, retestError, copyAllError, getContestError, copyError ], setErrorMessages);
    }, [ deleteAllError, retestError, copyAllError, getContestError, copyError ]);

    useEffect(() => {
        const message = getAndSetSuccesfullMessages([ deleteAllData, retestData, copyAllData, copyData ]);
        setSuccessMessage(message);
    }, [ deleteAllData, retestData, copyAllData, copyData ]);

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
        if (contestsAutocompleteData) {
            setContestsAutocomplete(contestsAutocompleteData);
        }
    }, [ contestsAutocompleteData ]);

    useEffect(() => {
        if (isSuccesfullyDeletedAll) {
            retakeData();
        }
    }, [ isSuccesfullyDeletedAll ]);

    useEffect(() => {
        if (isSuccesfullyCoppiedAll) {
            setShowCopyAllModal(false);
        }
        if (isSuccesfullyCoppied) {
            setShowCopyModal(false);
        }
    }, [ isSuccesfullyCoppiedAll, isSuccesfullyCoppied ]);

    const onCopyAllChange = debounce((e: any) => {
        setContestSearchString(e.target.value);
    }, 300);

    const onCopySelect = (contest: IContestAutocomplete) => {
        setContestToCopy(contest);
    };

    const onCopyAll = () => {
        copyAll({ sourceContestId: contestId, destinationContestId: contestToCopy!.id });
        setContestSearchString('');
    };

    const onCopy = () => {
        copy({ destinationContestId: contestToCopy!.id, problemId: problemToCopy!, newProblemGroup });
        setContestSearchString('');
    };

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

    const openCopyModal = (id: number) => {
        setProblemToCopy(id);
        setShowCopyModal(true);
        setSkipContestAutocomplete(false);
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

    const renderCopyModal = (
        index: number,
        showModal: boolean,
        setShowModal: Function,
        onChange: Function,
        onInputChange: Function,
        options:IContestAutocomplete[],
        sourceName: string | undefined,
        onSubmit: Function,
        isLoading: boolean,
        destination: IContestAutocomplete | null,
        operation:string
    ) => (
        <Modal
          key={index}
          open={showModal && problemsData!.totalItemsCount > 0}
          onClose={() => setShowModal(!showModal)}
        >
            <Box sx={modalStyles}>
                {isLoading
                    ? <SpinningLoader />
                    : (
                        <>
                            <Typography variant="h5" padding="0.5rem">Copy Problems</Typography>
                            <Autocomplete
                              options={options}
                              renderInput={(params) => <TextField {...params} label="Select Contest" key={params.id} />}
                              onChange={(event, newValue) => onChange(newValue!)}
                              onInputChange={(event) => onInputChange(event)}
                              value={null}
                              isOptionEqualToValue={(option, value) => option.id === value.id}
                              getOptionLabel={(option) => option?.name}
                              renderOption={(properties, option) => (
                                  <MenuItem {...properties} key={option.id} value={option.id}>
                                      {option.name}
                                  </MenuItem>
                              )}
                            />
                            {
                            operation === 'copy' &&
                            <TextField sx={{mt:2}} label="Copy To new Problem Group" type="number" onChange={(e) => setNewProblemGroup(Number(e.target.value))} />
                        }
                            {destination !== null && (
                            <Box sx={{ padding: '4rem' }}>
                                <Typography sx={{ display: 'flex', justifyContent: 'space-around' }}>
                                    {sourceName}
                                    {' '}
                                    <FaLongArrowAltRight />
                                    {destination?.name}
                                </Typography>
                            </Box>
                            )}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <Button variant="contained" disabled={destination === null} onClick={() => onSubmit()}>Copy</Button>
                            </Box>
                        </>
                    )}
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
                    setSkipContestAutocomplete(false);
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
                            retestProblem,
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
                              modal: (i) => renderCopyModal(
                                  i,
                                  showCopyAllModal,
                                  setShowCopyAllModal,
                                  onCopySelect,
                                  onCopyAllChange,
                                  problemsCopyAllData,
                                  problemsData?.items![0].contest,
                                  onCopyAll,
                                  isCoppyingAll,
                                  contestToCopy,
                                  "copyAll",
                              ),
                          },
                          {
                              showModal: showCopyModal,
                              modal: (i) => renderCopyModal(
                                  i,
                                  showCopyModal,
                                  setShowCopyModal,
                                  onCopySelect,
                                  onCopyAllChange,
                                  problemsCopyAllData,
                                problemsData?.items![0].contest,
                                onCopy,
                                isCoppying,
                                contestToCopy,
                                "copy",
                              ),
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
