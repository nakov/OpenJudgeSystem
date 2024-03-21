import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { IGetAllAdminParams } from '../../../common/types';
import AdministrationModal from '../../../components/administration/common/modals/administration-modal/AdministrationModal';
import UserForm from '../../../components/administration/users/form/UserForm';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import { setAdminUsersFilters, setAdminUsersSorters } from '../../../redux/features/admin/usersAdminSlice';
import { useGetAllUsersQuery } from '../../../redux/services/admin/usersAdminService';
import { useAppSelector } from '../../../redux/store';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import AdministrationGridView from '../AdministrationGridView';

import usersFilterableColumns, { returnUsersNonFilterableColumns } from './usersGridColumns';

const location = 'all-users';
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

    const selectedFilters = useAppSelector((state) => state.adminUsers[location]?.selectedFilters);
    const selectedSorters = useAppSelector((state) => state.adminUsers[location]?.selectedSorters);

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
          setFilterStateAction={setAdminUsersFilters}
          setSorterStateAction={setAdminUsersSorters}
          location={location}
          modals={
            [
                { showModal: showEditModal, modal: (i) => renderUserModal(i) },
            ]
          }
        />
    );
};
export default AdministrationUsersPage;
