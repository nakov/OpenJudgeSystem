/* eslint-disable react/react-in-jsx-scope */
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import ReplayIcon from '@mui/icons-material/Replay';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import { Box, IconButton, Modal } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { IGetAllAdminParams, IRootStore } from '../../../../../../common/types';
import AdministrationGridView from '../../../../../../pages/administration-new/AdministrationGridView';
import { setAdminContestsFilters, setAdminContestsSorters } from '../../../../../../redux/features/admin/contestsAdminSlice';
import { useGetContestProblemsQuery, useRetestByIdMutation } from '../../../../../../redux/services/admin/problemsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../../../../utils/constants';
import { modalStyles } from '../../../../../../utils/object-utils';
import { Alert, AlertSeverity, AlertVariant } from '../../../../../guidelines/alert/Alert';
import SpinningLoader from '../../../../../guidelines/spinning-loader/SpinningLoader';
import DeleteProblem from '../../../../Problems/delete/DeleteProblem';
import ProblemForm from '../../../../Problems/problemForm/ProblemForm';

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

    const { data: problemsData, error } = useGetContestProblemsQuery({ id: Number(contestId) });
    const [ openEditModal, setOpenEditModal ] = useState<boolean>(false);
    const [ problemId, setProblemId ] = useState<number>(-1);
    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        ItemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: '',
        sorting: '',
    });

    const [ retestById, { data: retestData, isSuccess: isSuccessfullyRetest, isLoading: isRetesting } ] = useRetestByIdMutation();

    const onEditClick = (id: number) => {
        setOpenEditModal(true);
        setProblemId(id);
    };

    const renderEditProblemModal = () => (
        <Modal
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
        >
            <Box sx={modalStyles}>
                <ProblemForm contestId={Number(contestId)} problemId={problemId} />
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
            flex: 0,
            type: 'string',
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
    const renderActionButtons = () => <div />;
    return (
        <div>
            {isSuccessfullyRetest && renderAlert(retestData, AlertSeverity.Success)}
            {isRetesting && <SpinningLoader />}
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
              modals={[]}
              renderActionButtons={renderActionButtons}
              setFilterStateAction={setAdminContestsFilters}
              setSorterStateAction={setAdminContestsSorters}
            />
        </div>
    );
};

export default ProblemsInContestView;
