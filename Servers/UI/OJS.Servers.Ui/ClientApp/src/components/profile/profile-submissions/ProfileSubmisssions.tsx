import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useEffect } from 'react';
import { useSubmissions } from '../../../hooks/use-submissions';

const columns: GridColDef[] = [
    { field: 'id', headerName: '№', width: 90 },
    {
        field: 'submittedOn',
        headerName: 'Submitted On',
        width: 150,
        sortable: true,
    },
    {
        field: 'problem',
        headerName: 'Task',
        width: 150,
        sortable: true,
        valueGetter: (params: GridValueGetterParams) => `${params.row.problem.name}`,
    },
    {
        field: 'points',
        headerName: 'Points',
        type: 'number',
        width: 110,
        sortable: true,
        valueGetter: (params: GridValueGetterParams) => `${params.row.points}/${params.row.problem.maximumPoints}`,
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
