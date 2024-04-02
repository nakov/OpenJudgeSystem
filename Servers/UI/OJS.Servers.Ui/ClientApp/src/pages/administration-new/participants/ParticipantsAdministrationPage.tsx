import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { IGetAllAdminParams } from '../../../common/types';
import CreateButton from '../../../components/administration/common/create/CreateButton';
import AdministrationModal from '../../../components/administration/common/modals/administration-modal/AdministrationModal';
import ParticipantForm from '../../../components/administration/participants/form/ParticipantForm';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import { useDeleteParticipantMutation, useGetAllParticipantsQuery } from '../../../redux/services/admin/participantsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import { IAdministrationFilter } from '../administration-filters/AdministrationFilters';
import { IAdministrationSorter } from '../administration-sorting/AdministrationSorting';
import AdministrationGridView from '../AdministrationGridView';

import participantsFilteringColumns, { returnparticipantsNonFilterableColumns } from './participantsGridColumns';

const ParticipantsAdministrationPage = () => {
    const [ searchParams ] = useSearchParams();

    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: searchParams.get('filter') ?? '',
        sorting: searchParams.get('sorting') ?? '',
    });

    const [ selectedFilters, setSelectedFilters ] = useState<Array<IAdministrationFilter>>([]);
    const [ selectedSorters, setSelectedSorters ] = useState<Array<IAdministrationSorter>>([]);

    const [ openCreateModal, setOpenCreateModal ] = useState<boolean>(false);

    const {
        refetch: retakeParticipants,
        data: participantsData,
        isLoading: isLoadingParticipants,
        error,
    } = useGetAllParticipantsQuery(queryParams);

    const filterParams = searchParams.get('filter');
    const sortingParams = searchParams.get('sorting');

    useEffect(() => {
        setQueryParams((prevState) => ({ ...prevState, filter: filterParams ?? '' }));
    }, [ filterParams ]);

    useEffect(() => {
        setQueryParams((prevState) => ({ ...prevState, sorting: sortingParams ?? '' }));
    }, [ sortingParams ]);

    const onModalClose = () => {
        setOpenCreateModal(false);
        retakeParticipants();
    };

    const renderGridSettings = () => (
        <CreateButton
          showModal={openCreateModal}
          showModalFunc={setOpenCreateModal}
          styles={{ width: '40px', height: '40px', color: 'rgb(25,118,210)' }}
        />
    );

    const renderParticipantModal = (index: number) => (
        <AdministrationModal
          key={index}
          index={index}
          open={openCreateModal}
          onClose={() => onModalClose()}
        >
            <ParticipantForm />
        </AdministrationModal>
    );

    if (isLoadingParticipants) {
        return <SpinningLoader />;
    }

    return (
        <AdministrationGridView
          filterableGridColumnDef={participantsFilteringColumns}
          notFilterableGridColumnDef={returnparticipantsNonFilterableColumns(useDeleteParticipantMutation, retakeParticipants)}
          data={participantsData}
          error={error}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          selectedFilters={selectedFilters || []}
          setSorterStateAction={setSelectedSorters}
          setFilterStateAction={setSelectedFilters}
          selectedSorters={selectedSorters || []}
          renderActionButtons={renderGridSettings}
          modals={[
              { showModal: openCreateModal, modal: (i) => renderParticipantModal(i) },
          ]}
        />
    );
};
export default ParticipantsAdministrationPage;
