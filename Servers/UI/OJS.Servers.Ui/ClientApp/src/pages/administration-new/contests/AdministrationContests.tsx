/* eslint-disable no-restricted-globals */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { IconButton, Tooltip } from '@mui/material';

import { CREATE_NEW_ENTITY } from '../../../common/labels';
import { CONTEST_IS_DELETED, CONTEST_IS_NOT_VISIBLE } from '../../../common/messages';
import { IGetAllAdminParams, IRootStore } from '../../../common/types';
import AdministrationModal from '../../../components/administration/common/modals/administration-modal/AdministrationModal';
import ContestEdit from '../../../components/administration/contests/contest-edit/ContestEdit';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import { setAdminContestsFilters, setAdminContestsSorters } from '../../../redux/features/admin/contestsAdminSlice';
import { useDeleteContestMutation, useGetAllAdminContestsQuery } from '../../../redux/services/admin/contestsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import { flexCenterObjectStyles } from '../../../utils/object-utils';
import AdministrationGridView from '../AdministrationGridView';

import contestFilterableColumns, { returnContestsNonFilterableColumns } from './contestsGridColumns';

const AdministrationContestsPage = () => {
    const [ searchParams ] = useSearchParams();
    const [ openEditContestModal, setOpenEditContestModal ] = useState(false);
    const [ openShowCreateContestModal, setOpenShowCreateContestModal ] = useState<boolean>(false);
    const [ contestId, setContestId ] = useState<number>();
    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({ page: 1, ItemsPerPage: DEFAULT_ITEMS_PER_PAGE, filter: searchParams.get('filter') ?? '', sorting: searchParams.get('sorting') ?? '' });
    const selectedFilters = useSelector((state: IRootStore) => state.adminContests['all-contests']?.selectedFilters);
    const selectedSorters = useSelector((state: IRootStore) => state.adminContests['all-contests']?.selectedSorters);
    const {
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

    const renderEditContestModal = (index: number) => (
        <AdministrationModal
          index={index}
          open={openEditContestModal}
          onClose={() => setOpenEditContestModal(false)}
        >
            <ContestEdit contestId={Number(contestId)} />
        </AdministrationModal>
    );

    const renderCreateContestModal = (index: number) => (
        <AdministrationModal index={index} open={openShowCreateContestModal} onClose={() => setOpenShowCreateContestModal(!openShowCreateContestModal)}>
            <ContestEdit contestId={null} isEditMode={false} />
        </AdministrationModal>
    );

    const renderGridActions = () => (
        <Tooltip title={CREATE_NEW_ENTITY}>
            <IconButton
              onClick={() => setOpenShowCreateContestModal(!openShowCreateContestModal)}
            >
                <AddBoxIcon sx={{ width: '40px', height: '40px' }} color="primary" />
            </IconButton>
        </Tooltip>
    );

    if (isLoading) {
        return <div style={{ ...flexCenterObjectStyles }}><SpinningLoader /></div>;
    }

    return (
        <AdministrationGridView
          data={data}
          error={error}
          filterableGridColumnDef={contestFilterableColumns}
          notFilterableGridColumnDef={returnContestsNonFilterableColumns(onEditClick, useDeleteContestMutation)}
          renderActionButtons={renderGridActions}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          selectedFilters={selectedFilters || []}
          selectedSorters={selectedSorters || []}
          setSorterStateAction={setAdminContestsSorters}
          setFilterStateAction={setAdminContestsFilters}
          location="all-contests"
          modals={[
              { showModal: openShowCreateContestModal, modal: (i) => renderCreateContestModal(i) },
              { showModal: openEditContestModal, modal: (i) => renderEditContestModal(i) },
          ]}
          legendProps={[ { color: '#FFA1A1', message: CONTEST_IS_DELETED }, { color: '#C0C0C0', message: CONTEST_IS_NOT_VISIBLE } ]}
        />
    );
};

export default AdministrationContestsPage;
