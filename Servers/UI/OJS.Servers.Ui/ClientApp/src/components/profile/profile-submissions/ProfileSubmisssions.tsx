import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSubmissions } from '../../../hooks/use-submissions';
import { formatDate } from '../../../utils/dates';
import ExecutionResult from '../../submissions/ExecutionResult';
import styles from './ProfileSubmissions.module.scss';

const columns: GridColDef[] = [
    { field: 'id', headerName: '№', minWidth: 70, flex: 1 },
    {
        field: 'submittedOn',
        headerName: 'Submitted On',
        minWidth: 160,
        flex: 1,
        sortable: true,
        valueGetter: (params: GridValueGetterParams) => `${formatDate(new Date(params.row.submittedOn))}`,
    },
    {
        field: 'problem',
        headerName: 'Task',
        minWidth: 150,
        flex: 1,
        sortable: true,
        renderCell: (params: GridValueGetterParams) => (
            <Link to={`/submission/${params.row.id}`} className={styles.contestLink}>{params.row.problem.name}</Link>
        ),
    },
    {
        field: 'points',
        headerName: 'Points',
        type: 'number',
        minWidth: 70,
        flex: 1,
        sortable: true,
        valueGetter: (params: GridValueGetterParams) => `${params.row.points}/${params.row.problem.maximumPoints}`,
    },
    {
        field: 'maxUsedTime',
        headerName: 'Memory Used',
        type: 'string',
        minWidth: 70,
        flex: 1,
        hide: true,
        sortable: false,
    },
    {
        field: 'maxUsedMemory',
        headerName: 'Memory Used',
        type: 'string',
        minWidth: 70,
        hide: true,
        sortable: true,
    },
    {
        field: 'executionResult',
        headerName: 'Execution Result',
        type: 'string',
        minWidth: 250,
        flex: 1,
        sortable: false,
        renderCell: (params: GridValueGetterParams) => (
            <ExecutionResult testRuns={params.row.testRuns} />
        ),
    },
];

const ProfileSubmissions = () => {
    const { submissions, getUserSubmissions } = useSubmissions();

    useEffect(() => {
        getUserSubmissions();
    }, [ getUserSubmissions ]);

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={submissions}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[ 5 ]}
              disableSelectionOnClick
            />
        </div>
    );
};

export default ProfileSubmissions;
