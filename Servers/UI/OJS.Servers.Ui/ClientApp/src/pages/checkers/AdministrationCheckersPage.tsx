import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { IGetAllAdminParams } from '../../common/types';
import CheckerForm from '../../components/administration/checkers/checker-form/CheckerForm';
import CreateButton from '../../components/administration/common/create/CreateButton';
import AdministrationModal from '../../components/administration/common/modals/administration-modal/AdministrationModal';
import SpinningLoader from '../../components/guidelines/spinning-loader/SpinningLoader';
import { useDeleteCheckerMutation, useGetAllCheckersQuery } from '../../redux/services/admin/checkersAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../utils/constants';
import { IAdministrationFilter } from '../administration-new/administration-filters/AdministrationFilters';
import { IAdministrationSorter } from '../administration-new/administration-sorting/AdministrationSorting';
import AdministrationGridView from '../administration-new/AdministrationGridView';

import checkersFilterableColumns, { returnCheckersNonFilterableColumns } from './checkersGridColumns';

const AdministrationCheckersPage = () => {
    const [ searchParams ] = useSearchParams();
    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: searchParams.get('filter') ?? '',
        sorting: searchParams.get('sorting') ?? '',
    });

    const [ selectedFilters, setSelectedFilters ] = useState<Array<IAdministrationFilter>>([]);
    const [ selectedSorters, setSelectedSorters ] = useState<Array<IAdministrationSorter>>([]);
    const [ openEditModal, setOpenEditModal ] = useState(false);
    const [ checkerId, setCheckerId ] = useState<number | null>(null);
    const [ openCreateModal, setOpenCreateModal ] = useState<boolean>(false);

    const {
        refetch: retakeCheckers,
        data: checkersData,
        isLoading: isLoadingCheckers,
        error: checkersError,
    } = useGetAllCheckersQuery(queryParams);

    const filterParams = searchParams.get('filter');
    const sortingParams = searchParams.get('sorting');
    useEffect(() => {
        setQueryParams((prevState) => ({ ...prevState, filter: filterParams ?? '' }));
    }, [ filterParams ]);

    useEffect(() => {
        setQueryParams((prevState) => ({ ...prevState, sorting: sortingParams ?? '' }));
    }, [ sortingParams ]);

    const onEditClick = (id: number) => {
        setCheckerId(id);
        setOpenEditModal(true);
    };

    const closeModal = (isEditMode: boolean) => {
        if (isEditMode) {
            setOpenEditModal(false);
        } else {
            setOpenCreateModal(false);
        }
        retakeCheckers();
    };

    const renderModal = (index: number, isEditMode: boolean) => (
        <AdministrationModal
          key={index}
          index={index}
          open={isEditMode
              ? openEditModal
              : openCreateModal}
          onClose={() => closeModal(isEditMode)}
        >
            <CheckerForm id={checkerId} isEditMode={isEditMode} />
        </AdministrationModal>
    );

    const renderGridSettings = () => (
        <CreateButton
          showModal={openCreateModal}
          showModalFunc={setOpenCreateModal}
          styles={{ width: '40px', height: '40px', color: 'rgb(25,118,210)' }}
        />
    );

    if (isLoadingCheckers) {
        return <SpinningLoader />;
    }

    return (
        <AdministrationGridView
          setSorterStateAction={setSelectedSorters}
          setFilterStateAction={setSelectedFilters}
          data={checkersData}
          error={checkersError}
          selectedFilters={selectedFilters || []}
          selectedSorters={selectedSorters || []}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          renderActionButtons={renderGridSettings}
          filterableGridColumnDef={checkersFilterableColumns}
          notFilterableGridColumnDef={returnCheckersNonFilterableColumns(onEditClick, useDeleteCheckerMutation, retakeCheckers)}
          modals={[
              { showModal: openEditModal, modal: (i) => renderModal(i, true) },
              { showModal: openCreateModal, modal: (i) => renderModal(i, false) },
          ]}
          legendProps={[ { color: '#FFA1A1', message: 'Checker is deleted.' } ]}
        />
    );
};

export default AdministrationCheckersPage;
