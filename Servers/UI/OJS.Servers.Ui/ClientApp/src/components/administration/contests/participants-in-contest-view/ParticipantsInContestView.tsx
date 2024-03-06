import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import { IconButton } from '@mui/material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { IGetAllAdminParams, IRootStore } from '../../../../common/types';
import {
    mapFilterParamsToQueryString,
} from '../../../../pages/administration-new/administration-filters/AdministrationFilters';
import {
    mapSorterParamsToQueryString,
} from '../../../../pages/administration-new/administration-sorting/AdministrationSorting';
import AdministrationGridView from '../../../../pages/administration-new/AdministrationGridView';
import { setAdminContestsFilters, setAdminContestsSorters } from '../../../../redux/features/admin/contestsAdminSlice';
import { useGetByContestIdQuery } from '../../../../redux/services/admin/participantsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../../utils/constants';

interface IParticipantsInContestView {
    contestId: number;
}

const ParticipantsInContestView = (props: IParticipantsInContestView) => {
    const { contestId } = props;
    const filtersAndSortersLocation = `contest-details-participants-${contestId}`;

    const selectedFilters =
        useSelector((state: IRootStore) => state.adminContests[filtersAndSortersLocation]?.selectedFilters) ?? [ ];
    const selectedSorters =
        useSelector((state: IRootStore) => state.adminContests[filtersAndSortersLocation]?.selectedSorters) ?? [ ];
    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: mapFilterParamsToQueryString(selectedFilters),
        sorting: mapSorterParamsToQueryString(selectedSorters),
    });
    const { data, error } = useGetByContestIdQuery({ contestId: Number(contestId), ...queryParams });

    const filtersQueryParams = mapFilterParamsToQueryString(selectedFilters);

    const sortersQueryParams = mapSorterParamsToQueryString(selectedSorters);

    useEffect(() => {
        setQueryParams((currentParams) => ({ ...currentParams, filter: filtersQueryParams }));
    }, [ filtersQueryParams ]);

    useEffect(() => {
        setQueryParams((currentParams) => ({ ...currentParams, sorting: sortersQueryParams }));
    }, [ sortersQueryParams ]);

    const onEditClick = (id: number) => {
        // setOpenModal(true);
        // setContestId(id);
        console.log(id);
    };

    const dataColumns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'Id',
            width: 10,
            align: 'center',
            headerAlign: 'center',
            type: 'number',
            filterable: false,
            sortable: false,
            flex: 0.5,
            valueFormatter: (params) => params.value.toString(),
        },
        {
            field: 'userName',
            headerName: 'UserName',
            width: 10,
            headerAlign: 'center',
            align: 'center',
            type: 'string',
            filterable: false,
            flex: 2,
            sortable: false,
        },
        {
            field: 'contest',
            headerName: 'Contest',
            width: 10,
            headerAlign: 'center',
            align: 'center',
            type: 'string',
            flex: 2,
            filterable: false,
            sortable: false,
        },
        {
            field: 'isOfficial',
            headerName: 'Is Official',
            headerAlign: 'center',
            width: 10,
            align: 'center',
            type: 'boolean',
            flex: 2,
            filterable: false,
            sortable: false,
        },
    ];

    const notFilterableGridColumns: GridColDef[] = [
        {
            field: 'showModal',
            headerName: 'Quick Details',
            width: 100,
            headerAlign: 'center',
            align: 'center',
            filterable: false,
            sortable: false,
            flex: 2,
            renderCell: (params: GridRenderCellParams) => (
                <IconButton onClick={() => onEditClick(params.row.id)}>
                    <EditIcon />
                </IconButton>
            ),
        },

        {
            field: 'showDetails',
            headerName: 'Details',
            width: 100,
            align: 'center',
            headerAlign: 'center',
            flex: 1,
            filterable: false,
            sortable: false,
            renderCell: (params: GridRenderCellParams) => (
                <Link to={`/administration/participants/${params.row.id}`}>
                    <ShortcutIcon />
                </Link>
            ),
        },
    ];

    // TODO when implement participants fill here the required actions
    const renderActions = () => (
        <div />
    );
    return (
        <div style={{ marginTop: '2rem' }}>
            <AdministrationGridView
              data={data}
              error={error}
              filterableGridColumnDef={dataColumns}
              notFilterableGridColumnDef={notFilterableGridColumns}
              location={filtersAndSortersLocation}
              queryParams={queryParams}
              renderActionButtons={renderActions}
              selectedFilters={selectedFilters}
              selectedSorters={selectedSorters}
              setFilterStateAction={setAdminContestsFilters}
              setSorterStateAction={setAdminContestsSorters}
              modals={[]}
              setQueryParams={setQueryParams}
              withSearchParams={false}
              legendProps={[ { color: '#FFA1A1', message: 'Participant is deleted.' } ]}
            />
        </div>
    );
};

export default ParticipantsInContestView;
