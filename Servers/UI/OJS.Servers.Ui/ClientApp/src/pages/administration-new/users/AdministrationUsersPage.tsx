import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { IGetAllAdminParams } from '../../../common/types';
import AdministrationModal from '../../../components/administration/common/modals/administration-modal/AdministrationModal';
import UserForm from '../../../components/administration/users/form/UserForm';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import { useGetAllUsersQuery } from '../../../redux/services/admin/usersAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import { IAdministrationFilter } from '../administration-filters/AdministrationFilters';
import { IAdministrationSorter } from '../administration-sorting/AdministrationSorting';
import AdministrationGridView from '../AdministrationGridView';

import usersFilterableColumns, { returnUsersNonFilterableColumns } from './usersGridColumns';

const AdministrationUsersPage = () => {
    const [ searchParams ] = useSearchParams();

    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: searchParams.get('filter') ?? '',
        sorting: searchParams.get('sorting') ?? '',
    });

    const [ showEditModal, setShowEditModal ] = useState<boolean>(false);
    const [ userId, setUserId ] = useState<string>('');

    const [ selectedFilters, setSelectedFilters ] = useState<Array<IAdministrationFilter>>([]);
    const [ selectedSorters, setSelectedSorters ] = useState<Array<IAdministrationSorter>>([]);

    const {
        refetch: retakeUsers,
        data: usersData,
        isLoading: isLoadingUsers,
        error,
    } = useGetAllUsersQuery(queryParams);

    const filterParams = searchParams.get('filter');
    const sortingParams = searchParams.get('sorting');

    useEffect(() => {
        setQueryParams((prevState) => ({ ...prevState, filter: filterParams ?? '' }));
    }, [ filterParams ]);

    useEffect(() => {
        setQueryParams((prevState) => ({ ...prevState, sorting: sortingParams ?? '' }));
    }, [ sortingParams ]);

    const onEditClick = (id: string) => {
        setShowEditModal(true);
        setUserId(id);
    };

    const renderUserModal = (index: number) => (
        <AdministrationModal
          key={index}
          index={index}
          open={showEditModal}
          onClose={() => {
              setShowEditModal(false);
              retakeUsers();
          }}
        >
            <UserForm id={userId} />
        </AdministrationModal>
    );

    if (isLoadingUsers) {
        return <SpinningLoader />;
    }

    return (
        <AdministrationGridView
          filterableGridColumnDef={usersFilterableColumns}
          notFilterableGridColumnDef={returnUsersNonFilterableColumns(onEditClick)}
          data={usersData}
          error={error}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          selectedFilters={selectedFilters || []}
          selectedSorters={selectedSorters || []}
          setSorterStateAction={setSelectedSorters}
          setFilterStateAction={setSelectedFilters}
          legendProps={[ { color: '#FFA1A1', message: 'User is deleted.' } ]}
          modals={
            [
                { showModal: showEditModal, modal: (i) => renderUserModal(i) },
            ]
          }
        />
    );
};
export default AdministrationUsersPage;
