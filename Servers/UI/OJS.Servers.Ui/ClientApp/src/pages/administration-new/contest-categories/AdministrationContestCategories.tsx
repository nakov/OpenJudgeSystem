/* eslint-disable no-restricted-globals */
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { IGetAllAdminParams } from '../../../common/types';
import CreateButton from '../../../components/administration/common/create/CreateButton';
import AdministrationModal from '../../../components/administration/common/modals/administration-modal/AdministrationModal';
import CategoryEdit from '../../../components/administration/contest-categories/CategoryEdit';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import { useGetAllAdminContestCategoriesQuery, useLazyExportContestCategoriesToExcelQuery } from '../../../redux/services/admin/contestCategoriesAdminService';
import { applyDefaultFilterToQueryString } from '../administration-filters/AdministrationFilters';
import AdministrationGridView, { defaultFilterToAdd, defaultSorterToAdd } from '../AdministrationGridView';

import categoriesFilterableColumns, { returnCategoriesNonFilterableColumns } from './contestCategoriesGridColumns';

const AdministrationContestCategoriesPage = () => {
    const [ searchParams ] = useSearchParams();
    // eslint-disable-next-line max-len
    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>(applyDefaultFilterToQueryString(defaultFilterToAdd, defaultSorterToAdd, searchParams));

    const [ openEditContestCategoryModal, setOpenEditContestCategoryModal ] = useState(false);
    const [ openShowCreateContestCategoryModal, setOpenShowCreateContestCategoryModal ] = useState<boolean>(false);
    const [ contestCategoryId, setContestCategoryId ] = useState<number>();

    const {
        refetch: retakeData,
        data,
        error,
        isLoading,
    } = useGetAllAdminContestCategoriesQuery(queryParams);

    const onEditClick = (id: number) => {
        setOpenEditContestCategoryModal(true);
        setContestCategoryId(id);
    };

    const onCloseModal = (isEditMode: boolean) => {
        if (isEditMode) {
            setOpenEditContestCategoryModal(false);
        } else {
            setOpenShowCreateContestCategoryModal(false);
        }
        retakeData();
    };

    const renderCategoryModal = (index: number, isEditMode: boolean) => (
        <AdministrationModal
          index={index}
          open={isEditMode
              ? openEditContestCategoryModal
              : openShowCreateContestCategoryModal}
          onClose={() => onCloseModal(isEditMode)}
        >
            <CategoryEdit
              contestCategoryId={isEditMode
                  ? Number(contestCategoryId)
                  : null}
              isEditMode={isEditMode}
            />
        </AdministrationModal>
    );

    const renderGridActions = () => (
        <CreateButton
          showModal={openShowCreateContestCategoryModal}
          showModalFunc={setOpenShowCreateContestCategoryModal}
          styles={{ width: '40px', height: '40px', color: 'rgb(25,118,210)' }}
        />
    );

    if (isLoading) {
        return <SpinningLoader />;
    }

    return (
        <AdministrationGridView
          data={data}
          error={error}
          filterableGridColumnDef={categoriesFilterableColumns}
          notFilterableGridColumnDef={returnCategoriesNonFilterableColumns(onEditClick)}
          renderActionButtons={renderGridActions}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          modals={[
              { showModal: openShowCreateContestCategoryModal, modal: (i) => renderCategoryModal(i, false) },
              { showModal: openEditContestCategoryModal, modal: (i) => renderCategoryModal(i, true) },
          ]}
          legendProps={[ { color: '#FFA1A1', message: 'Category is deleted.' }, { color: '#C0C0C0', message: 'Category is not visible' } ]}
          excelMutation={useLazyExportContestCategoriesToExcelQuery}
        />
    );
};

export default AdministrationContestCategoriesPage;
