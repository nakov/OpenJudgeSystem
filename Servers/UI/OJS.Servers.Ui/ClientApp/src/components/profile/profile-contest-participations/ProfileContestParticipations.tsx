import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { IParticipationType, useParticipations } from '../../../hooks/use-participations';
import { useUsers } from '../../../hooks/use-users';
import { IAuthorizationReduxState } from '../../../redux/features/authorizationSlice';
import { DEFAULT_ROWS_PER_PAGE } from '../../../utils/constants';
import { formatDate } from '../../../utils/dates';
import { decodeUsernameFromUrlParam } from '../../../utils/urls';
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
    const { internalUser: user } =
        useSelector((state: {authorization: IAuthorizationReduxState}) => state.authorization);
    const {
        state: { userParticipations },
        actions: { getUserParticipations },
    } = useParticipations();
    const { state: { isProfileInfoLoaded, myProfile } } = useUsers();
    const { username } = useParams();

    useEffect(
        () => {
            if (!isProfileInfoLoaded) {
                return;
            }

            if (!isEmpty(userParticipations)) {
                return;
            }

            const usernameParam = !isNil(username)
                ? username
                : myProfile.userName;

            getUserParticipations(decodeUsernameFromUrlParam(usernameParam));
        },
        [ isProfileInfoLoaded, getUserParticipations, user.userName, myProfile.userName, username, userParticipations ],
    );

    useEffect(
        () => setNumberedRows(userParticipations.map((row, index) => ({ ...row, rowNumber: index + 1 })) || []),

        [ userParticipations ],
    );

    return (
        <>
            <Heading type={HeadingType.primary}>Participations:</Heading>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                  getRowId={(row) => row.id}
                  rows={numberedRows}
                  columns={columns}
                  pageSizeOptions={[ ...DEFAULT_ROWS_PER_PAGE ]}
                />
            </div>
        </>
    );
};

export default ProfileContestParticipations;
