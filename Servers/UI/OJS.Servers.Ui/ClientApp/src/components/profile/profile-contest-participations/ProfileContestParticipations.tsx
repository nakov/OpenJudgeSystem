import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import { IParticipationType, useParticipations } from '../../../hooks/use-participations';
import { formatDate } from '../../../utils/dates';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';

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
    const [ numberedRows, setNumberedRows ] =
        useState<Array<IParticipationType>>([]);

    const {
        areUserParticipationsRetrieved,
        userParticipations,
        getUserParticipations,
    } = useParticipations();

    useEffect(
        () => {
            if (areUserParticipationsRetrieved) {
                return;
            }

            (async () => {
                await getUserParticipations();
            })();
        },
        [ areUserParticipationsRetrieved, getUserParticipations, userParticipations ],
    );

    useEffect(
        () => setNumberedRows(userParticipations.map((row, index) => ({ ...row, rowNumber: index + 1 })) || []),

        [ userParticipations ],
    );

    return (
        <>
            <Heading type={HeadingType.secondary}>Participations:</Heading>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                  getRowId={(row) => row.id}
                  rows={numberedRows}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[ 5 ]}
                  disableSelectionOnClick
                />
            </div>
        </>
    );
};

export default ProfileContestParticipations;
