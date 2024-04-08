import { useEffect, useState } from 'react';

import { IGetAllAdminParams } from '../../../../common/types';
import {
    IAdministrationFilter,
    mapFilterParamsToQueryString,
} from '../../../../pages/administration-new/administration-filters/AdministrationFilters';
import {
    IAdministrationSorter,
    mapSorterParamsToQueryString,
} from '../../../../pages/administration-new/administration-sorting/AdministrationSorting';
import AdministrationGridView from '../../../../pages/administration-new/AdministrationGridView';
import participantsFilteringColumns, { returnparticipantsNonFilterableColumns } from '../../../../pages/administration-new/participants/participantsGridColumns';
import { useGetByContestIdQuery } from '../../../../redux/services/admin/participantsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../../utils/constants';
import CreateButton from '../../common/create/CreateButton';
import AdministrationModal from '../../common/modals/administration-modal/AdministrationModal';
import ParticipantForm from '../../participants/form/ParticipantForm';

interface IParticipantsInContestView {
    contestId: number;
    contestName: string;
}

const ParticipantsInContestView = (props: IParticipantsInContestView) => {
    const { contestId, contestName } = props;

    const [ openCreateModal, setOpenCreateModal ] = useState<boolean>(false);

    const [ selectedFilters, setSelectedFilters ] = useState<Array<IAdministrationFilter>>([]);
    const [ selectedSorters, setSelectedSorters ] = useState<Array<IAdministrationSorter>>([]);

    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: mapFilterParamsToQueryString(selectedFilters),
        sorting: mapSorterParamsToQueryString(selectedSorters),
    });
    const { refetch, data, error } = useGetByContestIdQuery({ contestId: Number(contestId), ...queryParams });

    const filtersQueryParams = mapFilterParamsToQueryString(selectedFilters);

    const sortersQueryParams = mapSorterParamsToQueryString(selectedSorters);

    useEffect(() => {
        setQueryParams((currentParams) => ({ ...currentParams, filter: filtersQueryParams }));
    }, [ filtersQueryParams ]);

    useEffect(() => {
        setQueryParams((currentParams) => ({ ...currentParams, sorting: sortersQueryParams }));
    }, [ sortersQueryParams ]);

    const onModalClose = () => {
        setOpenCreateModal(false);
        refetch();
    };

    const renderActions = () => (
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
            <ParticipantForm contestId={contestId} contestName={contestName} />
        </AdministrationModal>
    );

    return (
        <div style={{ marginTop: '2rem' }}>
            <AdministrationGridView
              data={data}
              error={error}
              filterableGridColumnDef={participantsFilteringColumns}
              notFilterableGridColumnDef={returnparticipantsNonFilterableColumns(refetch)}
              queryParams={queryParams}
              renderActionButtons={renderActions}
              selectedFilters={selectedFilters}
              selectedSorters={selectedSorters}
              setSorterStateAction={setSelectedSorters}
              setFilterStateAction={setSelectedFilters}
              modals={[
                  { showModal: openCreateModal, modal: (i) => renderParticipantModal(i) },
              ]}
              setQueryParams={setQueryParams}
              withSearchParams={false}
              legendProps={[ { color: '#FFA1A1', message: 'Participant is deleted.' } ]}

            />
        </div>
    );
};

export default ParticipantsInContestView;
