import { useEffect, useState } from 'react';

import { IGetAllAdminParams } from '../../../../common/types';
import { mapFilterParamsToQueryString } from '../../../../pages/administration-new/administration-filters/AdministrationFilters';
import { mapSorterParamsToQueryString } from '../../../../pages/administration-new/administration-sorting/AdministrationSorting';
import AdministrationGridView from '../../../../pages/administration-new/AdministrationGridView';
import usersFilterableColumns, { returnUsersNonFilterableColumns } from '../../../../pages/administration-new/users/usersGridColumns';
import { setAdminRolesFilters, setAdminRolesSorters } from '../../../../redux/features/admin/rolesAdminSlice';
import { useDeleteUserMutation, useGetUsersByRoleQuery } from '../../../../redux/services/admin/usersAdminService';
import { useAppSelector } from '../../../../redux/store';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../../utils/constants';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';

interface IUsersInRoleViewProps {
    roleId: string;
}
const UsersInRoleView = (props: IUsersInRoleViewProps) => {
    const { roleId } = props;

    const filtersAndSortersLocation = `users-in-role-${roleId}`;

    const selectedFilters =
useAppSelector((state) => state.adminContests[filtersAndSortersLocation]?.selectedFilters) ?? [ ];
    const selectedSorters =
useAppSelector((state) => state.adminContests[filtersAndSortersLocation]?.selectedSorters) ?? [ ];

    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: mapFilterParamsToQueryString(selectedFilters),
        sorting: mapSorterParamsToQueryString(selectedSorters),
    });

    const filtersQueryParams = mapFilterParamsToQueryString(selectedFilters);

    const sortersQueryParams = mapSorterParamsToQueryString(selectedSorters);

    const {
        refetch,
        data: usersData,
        error: getError,
        isLoading: isGetting,
    } = useGetUsersByRoleQuery({ roleId, ...queryParams });

    useEffect(() => {
        setQueryParams((currentParams) => ({ ...currentParams, filter: filtersQueryParams }));
    }, [ filtersQueryParams ]);

    useEffect(() => {
        setQueryParams((currentParams) => ({ ...currentParams, sorting: sortersQueryParams }));
    }, [ sortersQueryParams ]);

    const onEditClick = (id: string) => {
        console.log(`Edit for id ${id}clicked!`);
    };

    const onUserDelete = () => {
        refetch();
    };
    if (isGetting) {
        return (
            <SpinningLoader />
        );
    }

    return (
        <div style={{ marginTop: '2rem' }}>
            <AdministrationGridView
              filterableGridColumnDef={usersFilterableColumns}
              notFilterableGridColumnDef={returnUsersNonFilterableColumns(onEditClick, useDeleteUserMutation, onUserDelete)}
              data={usersData}
              error={getError}
              queryParams={queryParams}
              location={filtersAndSortersLocation}
              selectedFilters={selectedFilters}
              selectedSorters={selectedSorters}
              setQueryParams={setQueryParams}
              setFilterStateAction={setAdminRolesFilters}
              setSorterStateAction={setAdminRolesSorters}
              withSearchParams={false}
            />
        </div>
    );
};
export default UsersInRoleView;
