import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { IGetAllAdminParams } from '../../../common/types';
import CreateButton from '../../../components/administration/common/create/CreateButton';
import AdministrationModal from '../../../components/administration/common/modals/administration-modal/AdministrationModal';
import ParticipantForm from '../../../components/administration/participants/form/ParticipantForm';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import { setAdminParticipantsFilters, setAdminParticipantsSorters } from '../../../redux/features/admin/participantsAdminSlice';
import { useDeleteParticipantMutation, useGetAllParticipantsQuery, useLazyExportParticipantsToExcelQuery } from '../../../redux/services/admin/participantsAdminService';
import { useAppSelector } from '../../../redux/store';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import AdministrationGridView from '../AdministrationGridView';

import participantsFilteringColumns, { returnparticipantsNonFilterableColumns } from './participantsGridColumns';

const location = 'all-participants';

const ParticipantsAdministrationPage = () => {
    const [ searchParams ] = useSearchParams();

    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: searchParams.get('filter') ?? '',
        sorting: searchParams.get('sorting') ?? '',
    });

    const [ openCreateModal, setOpenCreateModal ] = useState<boolean>(false);

    const selectedFilters = useAppSelector((state) => state.adminParticipants[location]?.selectedFilters);
    const selectedSorters = useAppSelector((state) => state.adminParticipants[location]?.selectedSorters);

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
          location={location}
          setQueryParams={setQueryParams}
          selectedFilters={selectedFilters || []}
          setFilterStateAction={setAdminParticipantsFilters}
          setSorterStateAction={setAdminParticipantsSorters}
          selectedSorters={selectedSorters || []}
          renderActionButtons={renderGridSettings}
          modals={[
              { showModal: openCreateModal, modal: (i) => renderParticipantModal(i) },
          ]}
          excelMutation={useLazyExportParticipantsToExcelQuery}
        />
    );
};
export default ParticipantsAdministrationPage;
