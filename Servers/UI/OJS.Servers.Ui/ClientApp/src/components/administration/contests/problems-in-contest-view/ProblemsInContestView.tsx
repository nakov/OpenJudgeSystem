import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Autocomplete, Box, Button, IconButton, MenuItem, Modal, TextField, Tooltip, Typography } from '@mui/material';
import debounce from 'lodash/debounce';

import { ExceptionData, IContestAutocomplete, IGetAllAdminParams, IRootStore } from '../../../../common/types';
import { mapFilterParamsToQueryString } from '../../../../pages/administration-new/administration-filters/AdministrationFilters';
import { mapSorterParamsToQueryString } from '../../../../pages/administration-new/administration-sorting/AdministrationSorting';
import AdministrationGridView from '../../../../pages/administration-new/AdministrationGridView';
import problemFilterableColums, { returnProblemsNonFilterableColumns } from '../../../../pages/administration-new/problems/problemGridColumns';
import { setAdminContestsFilters, setAdminContestsSorters } from '../../../../redux/features/admin/contestsAdminSlice';
import { useGetCopyAllQuery } from '../../../../redux/services/admin/contestsAdminService';
import { useCopyAllMutation, useDeleteByContestMutation, useDeleteProblemMutation, useGetContestProblemsQuery, useRetestByIdMutation } from '../../../../redux/services/admin/problemsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../../utils/constants';
import { flexCenterObjectStyles } from '../../../../utils/object-utils';
import { Alert, AlertSeverity, AlertVariant } from '../../../guidelines/alert/Alert';
import ConfirmDialog from '../../../guidelines/dialog/ConfirmDialog';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';
import CreateButton from '../../common/create/CreateButton';
import ProblemForm from '../../Problems/problemForm/ProblemForm';

interface IProblemsInContestViewProps {
    contestId: number;
}
const modalStyles = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    height: '80%',
    bgcolor: 'background.paper',
    borderRadius: 3,
    boxShadow: '0px 0px 19px -4px rgba(0,0,0,0.75)',
    p: 4,
    fontFamily: 'Roboto, Helvetica , Arial',
    overflow: 'auto',
};
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
    const [ problemsCopyAllData, setContestsAutocomplete ] = useState <Array<IContestAutocomplete>>([]);

    const [ showDeleteAllConfirm, setShowDeleteAllConfirm ] = useState<boolean>(false);

    const [ openShowCreateProblemModal, setOpenShowCreateProblemModal ] = useState<boolean>(false);
    const [ skipContestAutocomplete, setSkipContestAutocomplete ] = useState<boolean>(true);
    const [ showCopyAllModal, setShowCopyAllModal ] = useState<boolean>(false);
    const [ contestToCopy, setContestToCopy ] = useState<IContestAutocomplete| null>(null);
    const [ contestSearchString, setContestSearchString ] = useState<string>('');
    const { data: problemsData, error: getContestError } = useGetContestProblemsQuery({ contestId: Number(contestId), ...queryParams });
    const { data: contestsAutocompleteData } = useGetCopyAllQuery(contestSearchString, { skip: skipContestAutocomplete });

    const [ copyAll,
        {
            data: copyAllData,
            isSuccess: isSuccesfullyCoppiedAll,
            isLoading: isCoppyingAll,
            error: copyAllError,
            isError: isCopyAllError,
        } ] =
        useCopyAllMutation();

    useEffect(() => {
        if (contestsAutocompleteData) {
            setContestsAutocomplete(contestsAutocompleteData);
        }
    }, [ contestsAutocompleteData ]);
    const [ retestById,
        {
            data: retestData,
            isSuccess: isSuccessfullyRetest,
            isLoading: isRetesting,
            error: retestError,
            isError: isRetestError,
        } ] = useRetestByIdMutation();

    const [ deleteByContest,
        {
            data: deleteAllData,
            isSuccess: isSuccesfullyDeletedAll,
            isLoading: isDeletingAll,
            error: deleteAllError,
            isError: isDeleteAllError,
        } ] = useDeleteByContestMutation();

    const filtersQueryParams = mapFilterParamsToQueryString(selectedFilters);

    const sortersQueryParams = mapSorterParamsToQueryString(selectedSorters);

    useEffect(() => {
        let errors: Array<string> = [];

        const extractMessages = (error: unknown): Array<string> => {
            if (Array.isArray(error) && error.every((e) => 'message' in e)) {
                return error.map((x: ExceptionData) => x.message);
            }
            return [];
        };

        if (isDeleteAllError) {
            errors = errors.concat(extractMessages(deleteAllError));
        }
        if (isRetestError) {
            errors = errors.concat(extractMessages(retestError));
        }
        if (isCopyAllError) {
            errors = errors.concat(extractMessages(copyAllError));
        }

        setErrorMessages(errors);
    }, [ isDeleteAllError, isRetestError, isCopyAllError, deleteAllError, retestError, copyAllError ]);

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

    const renderEditProblemModal = (index: number) => (
        <Modal
          key={index}
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
        >
            <Box sx={modalStyles}>
                <ProblemForm contestId={Number(contestId)} problemId={problemId} />
            </Box>
        </Modal>
    );

    const renderProblemsCreateModal = (index: number) => (
        <Modal key={index} open={openShowCreateProblemModal} onClose={() => setOpenShowCreateProblemModal(!openShowCreateProblemModal)}>
            <Box sx={modalStyles}>
                <ProblemForm contestId={Number(contestId)} isEditMode={false} problemId={null} />
            </Box>
        </Modal>
    );

    useEffect(() => {
        if (isSuccesfullyCoppiedAll) {
            setShowCopyAllModal(false);
        }
    }, [ isSuccesfullyCoppiedAll ]);

    const onCopyAllChange = debounce((e: any) => {
        setContestSearchString(e.target.value);
    }, 300);

    const onCopyAllSelect = (contest: IContestAutocomplete) => {
        setContestToCopy(contest);
    };

    const onCopyAll = () => {
        copyAll({ sourceContestId: contestId, destinationContestId: contestToCopy!.id });
    };

    const renderCopyAllModal = (index: number) => (
        <Modal
          key={index}
          open={showCopyAllModal && problemsData!.totalItemsCount > 0}
          onClose={() => setShowCopyAllModal(!showCopyAllModal)}
        >
            <Box sx={modalStyles}>
                {isCoppyingAll
                    ? <SpinningLoader />
                    : (
                        <>
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
                            {contestToCopy !== null && (
                            <Box sx={{ padding: '4rem' }}>
                                <Typography sx={{ display: 'flex', justifyContent: 'space-around' }}>
                                    {problemsData?.items![0].contest}
                                    {' '}
                                    <ArrowRightAltIcon />
                                    {contestToCopy?.name}
                                </Typography>
                            </Box>
                            )}
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <Button variant="contained" disabled={contestToCopy === null} onClick={onCopyAll}>Copy</Button>
                            </Box>
                        </>
                    )}
            </Box>
        </Modal>
    );

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

    const renderAlert = (message: string, severity: AlertSeverity) => (
        <Alert
          severity={severity}
          message={message}
          variant={AlertVariant.Filled}
        />
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
                    <CopyAllIcon sx={{ width: '40px', height: '40px' }} color="primary" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Delete All">
                <IconButton onClick={() => setShowDeleteAllConfirm(!showDeleteAllConfirm)}>
                    <DeleteForeverIcon sx={{ width: '40px', height: '40px' }} color="error" />
                </IconButton>
            </Tooltip>
        </div>
    );

    return (
        <div style={{ marginTop: '2rem' }}>
            {isSuccessfullyRetest && renderAlert(retestData, AlertSeverity.Success)}
            {isSuccesfullyDeletedAll && renderAlert(deleteAllData, AlertSeverity.Success)}
            {isSuccesfullyCoppiedAll && renderAlert(copyAllData!, AlertSeverity.Success)}
            {errorMessages.map((x: string) => renderAlert(x, AlertSeverity.Error))}
            {(isRetesting || isDeletingAll) && <SpinningLoader />}
            <AdministrationGridView
              data={problemsData}
              error={getContestError}
              filterableGridColumnDef={problemFilterableColums}
              notFilterableGridColumnDef={returnProblemsNonFilterableColumns(onEditClick, useDeleteProblemMutation, retestProblem)}
              queryParams={queryParams}
              location={filtersAndSortersLocation}
              selectedFilters={selectedFilters}
              selectedSorters={selectedSorters}
              setQueryParams={setQueryParams}
              modals={[
                  { showModal: openEditModal, modal: (i) => renderEditProblemModal(i) },
                  { showModal: openShowCreateProblemModal, modal: (i) => renderProblemsCreateModal(i) },
                  { showModal: showDeleteAllConfirm, modal: (i) => renderDeleteAllModal(i) },
                  { showModal: showCopyAllModal, modal: (i) => renderCopyAllModal(i) },
              ]}
              renderActionButtons={renderGridSettings}
              setFilterStateAction={setAdminContestsFilters}
              setSorterStateAction={setAdminContestsSorters}
              withSearchParams={false}
              legendProps={[ { color: '#FFA1A1', message: 'Problem is deleted.' } ]}
            />
        </div>
    );
};

export default ProblemsInContestView;
