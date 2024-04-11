/* eslint-disable no-restricted-globals */
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { IGetAllAdminParams } from '../../../common/types';
import CreateButton from '../../../components/administration/common/create/CreateButton';
import AdministrationModal from '../../../components/administration/common/modals/administration-modal/AdministrationModal';
import CategoryEdit from '../../../components/administration/ContestCategories/CategoryEdit/CategoryEdit';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import { useDeleteContestCategoryMutation, useGetAllAdminContestCategoriesQuery, useLazyExportContestCategoriesToExcelQuery } from '../../../redux/services/admin/contestCategoriesAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import { applyDefaultFilterToQueryString, IAdministrationFilter, mapGridColumnsToAdministrationFilterProps, mapUrlToFilters } from '../administration-filters/AdministrationFilters';
import { IAdministrationSorter, mapGridColumnsToAdministrationSortingProps, mapUrlToSorters } from '../administration-sorting/AdministrationSorting';
import AdministrationGridView from '../AdministrationGridView';

import categoriesFilterableColumns, { returnCategoriesNonFilterableColumns } from './contestCategoriesGridColumns';

const AdministrationContestCategoriesPage = () => {
    const [ searchParams ] = useSearchParams();
    const [ queryParams, setQueryParams ] =
    useState<IGetAllAdminParams>({
        page: 1,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: applyDefaultFilterToQueryString(searchParams, categoriesFilterableColumns),
        sorting: searchParams.get('sorting') ?? '',
    });

    const [ openEditContestCategoryModal, setOpenEditContestCategoryModal ] = useState(false);
    const [ openShowCreateContestCategoryModal, setOpenShowCreateContestCategoryModal ] = useState<boolean>(false);
    const [ contestCategoryId, setContestCategoryId ] = useState<number>();

    const [ selectedFilters, setSelectedFilters ] = useState<Array<IAdministrationFilter>>(mapUrlToFilters(
        searchParams ?? '',
        mapGridColumnsToAdministrationFilterProps(categoriesFilterableColumns),
    ));

    const [ selectedSorters, setSelectedSorters ] = useState<Array<IAdministrationSorter>>(mapUrlToSorters(
        searchParams ?? '',
        mapGridColumnsToAdministrationSortingProps(categoriesFilterableColumns),
    ));

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

    useEffect(() => {
        setQueryParams((currentParams) => ({
            ...currentParams,
            filter: applyDefaultFilterToQueryString(searchParams, categoriesFilterableColumns),
            sorting: searchParams.get('sorting') ?? '',
        }));
    }, [ searchParams ]);

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
          notFilterableGridColumnDef={returnCategoriesNonFilterableColumns(onEditClick, useDeleteContestCategoryMutation)}
          renderActionButtons={renderGridActions}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          selectedFilters={selectedFilters || []}
          selectedSorters={selectedSorters || []}
          setSorterStateAction={setSelectedSorters}
          setFilterStateAction={setSelectedFilters}
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
