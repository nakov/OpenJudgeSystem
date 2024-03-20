import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { CONTEST_IS_DELETED, CONTEST_IS_NOT_VISIBLE } from '../../../common/messages';
import { IGetAllAdminParams } from '../../../common/types';
import CreateButton from '../../../components/administration/common/create/CreateButton';
import AdministrationModal from '../../../components/administration/common/modals/administration-modal/AdministrationModal';
import ContestEdit from '../../../components/administration/contests/contest-edit/ContestEdit';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import { setAdminContestsFilters, setAdminContestsSorters } from '../../../redux/features/admin/contestsAdminSlice';
import { useDeleteContestMutation, useGetAllAdminContestsQuery } from '../../../redux/services/admin/contestsAdminService';
import { useAppSelector } from '../../../redux/store';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import { flexCenterObjectStyles } from '../../../utils/object-utils';
import AdministrationGridView from '../AdministrationGridView';

import contestFilterableColumns, { returnContestsNonFilterableColumns } from './contestsGridColumns';

const AdministrationContestsPage = () => {
    const [ searchParams ] = useSearchParams();
    const [ openEditContestModal, setOpenEditContestModal ] = useState(false);
    const [ openShowCreateContestModal, setOpenShowCreateContestModal ] = useState<boolean>(false);
    const [ contestId, setContestId ] = useState<number>();
    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: searchParams.get('filter') ?? '',
        sorting: searchParams.get('sorting') ?? '',
    });

    const selectedFilters = useAppSelector((state) => state.adminContests['all-contests']?.selectedFilters);
    const selectedSorters = useAppSelector((state) => state.adminContests['all-contests']?.selectedSorters);

    const {
        refetch: retakeContests,
        data,
        error,
        isLoading,
    } = useGetAllAdminContestsQuery(queryParams);

    const onEditClick = (id: number) => {
        setOpenEditContestModal(true);
        setContestId(id);
    };

    const filterParams = searchParams.get('filter');
    const sortingParams = searchParams.get('sorting');

    useEffect(() => {
        setQueryParams((currentParams) => ({ ...currentParams, filter: filterParams ?? '' }));
    }, [ filterParams ]);

    useEffect(() => {
        setQueryParams((currentParams) => ({ ...currentParams, sorting: sortingParams ?? '' }));
    }, [ sortingParams ]);

    const onClose = (isEditMode: boolean) => {
        if (isEditMode) {
            setOpenEditContestModal(false);
        } else {
            setOpenShowCreateContestModal(false);
        }
        retakeContests();
    };
    const renderContestModal = (index: number, isEditMode: boolean) => (
        <AdministrationModal
          key={index}
          index={index}
          open={isEditMode
              ? openEditContestModal
              : openShowCreateContestModal}
          onClose={() => onClose(isEditMode)}
        >
            <ContestEdit
              contestId={isEditMode
                  ? Number(contestId)
                  : null}
              isEditMode={isEditMode}
              onSuccess={() => onClose(isEditMode)}
              onDeleteSuccess={() => onClose(isEditMode)}
            />
        </AdministrationModal>
    );

    const renderGridActions = () => (
        <CreateButton
          showModal={openShowCreateContestModal}
          showModalFunc={setOpenShowCreateContestModal}
          styles={{ width: '40px', height: '40px', color: 'rgb(25,118,210)' }}
        />
    );

    if (isLoading) {
        return <div style={{ ...flexCenterObjectStyles }}><SpinningLoader /></div>;
    }

    return (
        <AdministrationGridView
          data={data}
          error={error}
          filterableGridColumnDef={contestFilterableColumns}
          notFilterableGridColumnDef={returnContestsNonFilterableColumns(onEditClick, useDeleteContestMutation, retakeContests)}
          renderActionButtons={renderGridActions}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          selectedFilters={selectedFilters || []}
          selectedSorters={selectedSorters || []}
          setSorterStateAction={setAdminContestsSorters}
          setFilterStateAction={setAdminContestsFilters}
          location="all-contests"
          modals={[
              { showModal: openShowCreateContestModal, modal: (i) => renderContestModal(i, false) },
              { showModal: openEditContestModal, modal: (i) => renderContestModal(i, true) },
          ]}
          legendProps={[ { color: '#FFA1A1', message: CONTEST_IS_DELETED }, { color: '#C0C0C0', message: CONTEST_IS_NOT_VISIBLE } ]}
        />
    );
};

export default AdministrationContestsPage;
