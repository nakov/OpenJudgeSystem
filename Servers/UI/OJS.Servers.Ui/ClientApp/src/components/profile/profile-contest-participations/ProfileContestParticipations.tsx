import * as React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useEffect } from 'react';
import { formatDate } from '../../../utils/dates';
import { useParticipations } from '../../../hooks/use-participations';

const columns: GridColDef[] = [
    {
        field: 'contestName',
        headerName: 'Contest',
        minWidth: 160,
        flex: 1,
        sortable: true,
    },
    {
        field: 'registrationTime',
        headerName: 'Time',
        minWidth: 80,
        flex: 1,
        sortable: true,
        valueGetter: (params: GridValueGetterParams) => `${formatDate(new Date(params.row.registrationTime))}`,
    },
    {
        field: 'competeResult',
        headerName: 'Compete Result',
        type: 'string',
        minWidth: 70,
        flex: 1,
        sortable: false,
        valueGetter: (params: GridValueGetterParams) => `${params.row.competeResult}/${params.row.contestCompeteMaximumPoints}`,
    },
    {
        field: 'practiceResult',
        headerName: 'Practice Result',
        type: 'string',
        minWidth: 70,
        flex: 1,
        sortable: false,
        valueGetter: (params: GridValueGetterParams) => `${params.row.practiceResult}/${params.row.contestPracticeMaximumPoints}`,
    },
];

const ProfileContestParticipations = () => {
    const { areUserParticipationsRetrieved, userParticipations, getUserParticipations } = useParticipations();

    useEffect(() => {
        console.log(userParticipations);
        if (areUserParticipationsRetrieved) {
            return;
        }
        getUserParticipations();
    }, [ areUserParticipationsRetrieved, getUserParticipations, userParticipations ]);

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={userParticipations}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[ 5 ]}
              disableSelectionOnClick
            />
        </div>
    );
};

export default ProfileContestParticipations;
