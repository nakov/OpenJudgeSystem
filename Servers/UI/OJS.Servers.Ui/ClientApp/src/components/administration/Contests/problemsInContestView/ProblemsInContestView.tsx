/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import ReplayIcon from '@mui/icons-material/Replay';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import { Autocomplete, Box, Button, IconButton, MenuItem, Modal, TextField, Tooltip, Typography } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import debounce from 'lodash/debounce';

import { ExceptionData, IContestAutocomplete, IGetAllAdminParams, IRootStore } from '../../../../common/types';
import { mapFilterParamsToQueryString } from '../../../../pages/administration-new/administration-filters/AdministrationFilters';
import { mapSorterParamsToQueryString } from '../../../../pages/administration-new/administration-sorting/AdministrationSorting';
import AdministrationGridView from '../../../../pages/administration-new/AdministrationGridView';
import { setAdminContestsFilters, setAdminContestsSorters } from '../../../../redux/features/admin/contestsAdminSlice';
import { useGetCopyAllQuery } from '../../../../redux/services/admin/contestsAdminService';
import { useCopyAllMutation, useDeleteByContestMutation, useGetContestProblemsQuery, useRetestByIdMutation } from '../../../../redux/services/admin/problemsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../../utils/constants';
import { flexCenterObjectStyles } from '../../../../utils/object-utils';
import { Alert, AlertSeverity, AlertVariant } from '../../../guidelines/alert/Alert';
import ConfirmDialog from '../../../guidelines/dialog/ConfirmDialog';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';
import DeleteProblem from '../../Problems/delete/DeleteProblem';
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
    height: '40%',
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
    const { data: problemsData, error } = useGetContestProblemsQuery({ contestId: Number(contestId), ...queryParams });
    const {
        data: contestsAutocompleteData,
        isFetching: isFetchingCopyAllData,
    } = useGetCopyAllQuery(contestSearchString, { skip: skipContestAutocomplete });

    const [ copyAll ] = useCopyAllMutation();

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
        let messages: Array<string> = [];
        if (isDeleteAllError && deleteAllError) {
            messages = deleteAllError.data.map((x:ExceptionData) => x.message);
        }
        if (isRetestError && retestError) {
            messages = retestError.data?.map((x:ExceptionData) => x.message);
        }
        setErrorMessages(messages);
    }, [ isDeleteAllError, isRetestError ]);

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
        <Modal key={index} open={showCopyAllModal && problemsData!.totalCount > 0} onClose={() => setShowCopyAllModal(!showCopyAllModal)}>
            <Box sx={modalStyles}>
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
    const filterableColumns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'Id',
            flex: 1,
            type: 'number',
            filterable: false,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
            valueFormatter: (params) => params.value.toString(),
        },
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            type: 'string',
            filterable: false,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'contest',
            headerName: 'Contest',
            flex: 2,
            type: 'string',
            filterable: false,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'problemGroupId',
            headerName: 'Problem Group Id',
            flex: 0.5,
            type: 'number',
            filterable: false,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'problemGroup',
            headerName: 'Problem Group',
            flex: 1,
            type: 'string',
            filterable: false,
            align: 'center',
            sortable: false,
            headerAlign: 'center',
            valueFormatter: (params) => {
                if (params.value === '') {
                    return 'None';
                }
                return params.value.toString();
            },
        },
        {
            field: 'practiceTestsCount',
            headerName: 'Practice Tests',
            flex: 0.5,
            type: 'number',
            filterable: false,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'competeTestsCount',
            headerName: 'Compete Tests',
            flex: 0.5,
            type: 'number',
            filterable: false,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'isDeleted',
            headerName: 'Is Deleted',
            type: 'boolean',
            flex: 0.5,
            filterable: false,
            sortable: false,
            align: 'center',
            headerAlign: 'center',
        },
    ];

    const nonFilterableColumns: GridColDef[] = [
        {
            field: 'actions',
            headerName: 'Actions',
            width: 140,
            headerAlign: 'center',
            align: 'center',
            filterable: false,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <IconButton onClick={() => onEditClick(Number(params.row.id))}>
                        <EditIcon color="warning" />
                    </IconButton>
                    <Link to={`/administration-new/problems/${Number(params.row.id)}`}>
                        <ShortcutIcon color="primary" />
                    </Link>
                    <DeleteProblem
                      problemId={Number(params.row.id)}
                      problemName={params.row.name}
                      style={{ alignSelf: 'flex-end' }}
                    />
                    <IconButton onClick={() => retestProblem(Number(params.row.id))}>
                        <ReplayIcon />
                    </IconButton>
                </div>
            ),
        },
    ];

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
            <Tooltip title="Create new Problem">
                <IconButton
                  onClick={() => setOpenShowCreateProblemModal(!openShowCreateProblemModal)}
                >
                    <AddBoxIcon sx={{ width: '40px', height: '40px' }} color="primary" />
                </IconButton>
            </Tooltip>
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
            {errorMessages.map((x: string) => renderAlert(x, AlertSeverity.Error))}
            {(isRetesting || isDeletingAll) && <SpinningLoader />}
            <AdministrationGridView
              data={problemsData}
              error={error}
              filterableGridColumnDef={filterableColumns}
              notFilterableGridColumnDef={nonFilterableColumns}
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
            />
        </div>
    );
};

export default ProblemsInContestView;
