import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import { IconButton } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import AdministrationFilters, { mapGridColumnsToAdministrationFilterProps } from '../../../../../../pages/administration-new/administration-filters/AdministrationFilters';
import AdministrationSorting, { mapGridColumnsToAdministrationSortingProps } from '../../../../../../pages/administration-new/administration-sorting/AdministrationSorting';
import { useGetByContestIdQuery } from '../../../../../../redux/services/admin/participantsAdminService';
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_ROWS_PER_PAGE } from '../../../../../../utils/constants';

interface IParticipantsInContestView {
    contestId: number;
}

const ParticipantsInContestView = (props: IParticipantsInContestView) => {
    const { contestId } = props;
    const [ queryParams, setQueryParams ] = useState({ page: 1, ItemsPerPage: DEFAULT_ITEMS_PER_PAGE, filter: '', sorting: '' });
    const { data, error } = useGetByContestIdQuery({ contestId: Number(contestId), ...queryParams });

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
            flex: 0,
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

    const sortingColumns = mapGridColumnsToAdministrationSortingProps(dataColumns);

    const filtersColumns = mapGridColumnsToAdministrationFilterProps(dataColumns);

    return (
        <div style={{ height: '100vh', marginTop: '1rem' }}>
            <div style={{ height: '100vh' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '500px' }}>
                    <AdministrationFilters
                      columns={filtersColumns}
                      shouldUpdateUrl={false}
                      location={`contestDetailsParticipants-${contestId}`}
                    />
                    <AdministrationSorting columns={sortingColumns} />
                </div>
                { error
                    ? <div>Error loading data</div>
                    : (
                        <DataGrid
                          columns={dataColumns}
                          rows={data?.items ?? []}
                          rowCount={data?.totalCount ?? 0}
                          paginationMode="server"
                          onPageChange={(e) => {
                              setQueryParams({ ...queryParams, page: e + 1 });
                          }}
                          rowsPerPageOptions={[ ...DEFAULT_ROWS_PER_PAGE ]}
                          onPageSizeChange={(itemsPerRow: number) => {
                              setQueryParams({ ...queryParams, ItemsPerPage: itemsPerRow });
                          }}
                          pageSize={queryParams.ItemsPerPage}
                        />
                    )}
            </div>
        </div>
    );
};

export default ParticipantsInContestView;
