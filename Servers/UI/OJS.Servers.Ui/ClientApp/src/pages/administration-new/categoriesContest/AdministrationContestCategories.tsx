/* eslint-disable no-restricted-globals */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { IconButton, Modal, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';

import { IGetAllAdminParams, IRootStore } from '../../../common/types';
import CategoryEdit from '../../../components/administration/ContestCategories/CategoryEdit/CategoryEdit';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import { setAdminContestCategoriesFilters, setAdminContestCategoriesSorters } from '../../../redux/features/admin/contestCategoriesAdminSlice';
import { useDeleteContestCategoryMutation, useGetAllAdminContestCategoriesQuery } from '../../../redux/services/admin/contestCategoriesAdminService';
// import { useGetAllAdminContestsQuery } from '../../redux/services/admin/contestsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import { flexCenterObjectStyles, modalStyles } from '../../../utils/object-utils';
import AdministrationGridView from '../AdministrationGridView';

import categoriesFilterableColumns, { returnCategoriesNonFilterableColumns } from './contestCategoriesGridColumns';

const AdministrationContestCategoriesPage = () => {
    const [ searchParams ] = useSearchParams();
    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({ page: 1, itemsPerPage: DEFAULT_ITEMS_PER_PAGE, filter: searchParams.get('filter') ?? '', sorting: searchParams.get('sorting') ?? '' });
    const [ openEditContestCategoryModal, setOpenEditContestCategoryModal ] = useState(false);
    const [ openShowCreateContestCategoryModal, setOpenShowCreateContestCategoryModal ] = useState<boolean>(false);
    const [ contestCategoryId, setContestCategoryId ] = useState<number>();
    const selectedFilters = useSelector((state: IRootStore) => state.adminContestsCategories['all-contests-categories']?.selectedFilters);
    const selectedSorters = useSelector((state: IRootStore) => state.adminContestsCategories['all-contests-categories']?.selectedSorters);

    const {
        data,
        error,
        isLoading,
    } = useGetAllAdminContestCategoriesQuery(queryParams);

    const onEditClick = (id: number) => {
        setOpenEditContestCategoryModal(true);
        setContestCategoryId(id);
    };

    const filterParams = searchParams.get('filter');
    const sortingParams = searchParams.get('sorting');

    useEffect(() => {
        setQueryParams((currentParams) => ({ ...currentParams, filter: filterParams ?? '' }));
    }, [ filterParams ]);

    useEffect(() => {
        setQueryParams((currentParams) => ({ ...currentParams, sorting: sortingParams ?? '' }));
    }, [ sortingParams ]);

    const renderEditContestCategoryModal = (index: number) => (
        <Modal
          key={index}
          open={openEditContestCategoryModal}
          onClose={() => setOpenEditContestCategoryModal(false)}
        >
            <Box sx={modalStyles}>
                <CategoryEdit contestCategoryId={Number(contestCategoryId)} />
            </Box>
        </Modal>
    );

    const renderCreateContestCategoryModal = (index: number) => (
        <Modal key={index} open={openShowCreateContestCategoryModal} onClose={() => setOpenShowCreateContestCategoryModal(!openShowCreateContestCategoryModal)}>
            <Box sx={modalStyles}>
                <CategoryEdit contestCategoryId={null} isEditMode={false} />
            </Box>
        </Modal>
    );

    const renderGridActions = () => (
        <div style={{ ...flexCenterObjectStyles, justifyContent: 'space-between' }}>
            <Tooltip title="Create new contest category">
                <IconButton
                  onClick={() => setOpenShowCreateContestCategoryModal(!openShowCreateContestCategoryModal)}
                >
                    <AddBoxIcon sx={{ width: '40px', height: '40px' }} color="primary" />
                </IconButton>
            </Tooltip>
        </div>
    );

    if (isLoading) {
        return <div style={{ ...flexCenterObjectStyles }}><SpinningLoader /></div>;
    }

    return (
        <AdministrationGridView
          data={data}
          error={error}
          filterableGridColumnDef={categoriesFilterableColumns}
          notFilterableGridColumnDef={returnCategoriesNonFilterableColumns(onEditClick, useDeleteContestCategoryMutation)}
          renderActionButtons={renderGridActions}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          selectedFilters={selectedFilters || []}
          selectedSorters={selectedSorters || []}
          setSorterStateAction={setAdminContestCategoriesSorters}
          setFilterStateAction={setAdminContestCategoriesFilters}
          location="all-contests-categories"
          modals={[
              { showModal: openShowCreateContestCategoryModal, modal: (i) => renderCreateContestCategoryModal(i) },
              { showModal: openEditContestCategoryModal, modal: (i) => renderEditContestCategoryModal(i) },
          ]}
          legendProps={[ { color: '#FFA1A1', message: 'Category is deleted.' }, { color: '#C0C0C0', message: 'Category is not visible' } ]}
        />
    );
};

export default AdministrationContestCategoriesPage;
