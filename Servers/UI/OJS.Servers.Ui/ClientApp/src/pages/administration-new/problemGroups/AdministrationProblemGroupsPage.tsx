/* eslint-disable no-undefined */
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { IGetAllAdminParams } from '../../../common/types';
import CreateButton from '../../../components/administration/common/create/CreateButton';
import AdministrationModal from '../../../components/administration/common/modals/administration-modal/AdministrationModal';
import ProblemGroupForm from '../../../components/administration/problem-groups/problem-group-form/ProblemGroupForm';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import { useGetAllAdminProblemGroupsQuery, useLazyExportProblemGroupsToExcelQuery } from '../../../redux/services/admin/problemGroupsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import { getAndSetExceptionMessage } from '../../../utils/messages-utils';
import { flexCenterObjectStyles } from '../../../utils/object-utils';
import { renderErrorMessagesAlert } from '../../../utils/render-utils';
import { applyDefaultFilterToQueryString, IAdministrationFilter, mapGridColumnsToAdministrationFilterProps, mapUrlToFilters } from '../administration-filters/AdministrationFilters';
import { IAdministrationSorter, mapGridColumnsToAdministrationSortingProps, mapUrlToSorters } from '../administration-sorting/AdministrationSorting';
import AdministrationGridView from '../AdministrationGridView';

import filterableColumns, { returnNonFilterableColumns } from './problemGroupGridColumns';

const AdministrationProblemGroupsPage = () => {
    const [ searchParams ] = useSearchParams();
    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: applyDefaultFilterToQueryString(searchParams, filterableColumns),
        sorting: searchParams.get('sorting') ?? '',
    });
    const [ openEditModal, setOpenEditModal ] = useState<boolean>(false);
    const [ openCreateModal, setOpenCreateModal ] = useState<boolean>(false);
    const [ problemGroupId, setProblemGroupId ] = useState<number | undefined>(undefined);

    const [ selectedFilters, setSelectedFilters ] = useState<Array<IAdministrationFilter>>(mapUrlToFilters(
        searchParams ?? '',
        mapGridColumnsToAdministrationFilterProps(filterableColumns),
    ));

    const [ selectedSorters, setSelectedSorters ] = useState<Array<IAdministrationSorter>>(mapUrlToSorters(
        searchParams ?? '',
        mapGridColumnsToAdministrationSortingProps(filterableColumns),
    ));

    const { refetch: retakeGroups, data, isLoading, error } = useGetAllAdminProblemGroupsQuery(queryParams);
    const [ errorMessages, setErrorMessages ] = useState<Array<string>>([]);

    useEffect(() => {
        setQueryParams((currentParams) => ({
            ...currentParams,
            filter: applyDefaultFilterToQueryString(searchParams, filterableColumns),
            sorting: searchParams.get('sorting') ?? '',
        }));
    }, [ searchParams ]);

    useEffect(() => {
        getAndSetExceptionMessage([ error ], setErrorMessages);
    }, [ error ]);

    const onEditClick = (id: number) => {
        setOpenEditModal(true);
        setProblemGroupId(id);
    };

    const onFormModalClose = (isCreate: boolean) => {
        if (isCreate) {
            setOpenCreateModal(false);
        } else {
            setOpenEditModal(false);
        }

        retakeGroups();
    };

    const renderGridSettings = () => (
        <div style={{ ...flexCenterObjectStyles, justifyContent: 'space-between' }}>
            <CreateButton
              showModal={openCreateModal}
              showModalFunc={setOpenCreateModal}
              styles={{ width: '40px', height: '40px', color: 'rgb(25,118,210)' }}
            />
        </div>
    );

    if (isLoading) {
        return <div style={{ ...flexCenterObjectStyles }}><SpinningLoader /></div>;
    }

    const renderProblemModal = (index: number, isCreate: boolean) => (
        <AdministrationModal
          key={index}
          index={index}
          open={isCreate
              ? openCreateModal
              : openEditModal}
          onClose={() => onFormModalClose(isCreate)}
        >
            <ProblemGroupForm
              id={isCreate
                  ? 0
                  : problemGroupId}
              isEditMode={!isCreate}
            />
        </AdministrationModal>
    );

    return (
        <>
            {renderErrorMessagesAlert(errorMessages)}
            <AdministrationGridView
              filterableGridColumnDef={filterableColumns}
              notFilterableGridColumnDef={returnNonFilterableColumns(onEditClick)}
              data={data}
              renderActionButtons={renderGridSettings}
              error={error}
              queryParams={queryParams}
              setQueryParams={setQueryParams}
              selectedFilters={selectedFilters}
              selectedSorters={selectedSorters}
              setSorterStateAction={setSelectedSorters}
              setFilterStateAction={setSelectedFilters}
              modals={[
                  { showModal: openEditModal, modal: (i) => renderProblemModal(i, false) },
                  { showModal: openCreateModal, modal: (i) => renderProblemModal(i, true) },
              ]}
              legendProps={[ { color: '#FFA1A1', message: 'Problem Group is deleted.' } ]}
              excelMutation={useLazyExportProblemGroupsToExcelQuery}
            />
        </>
    );
};

export default AdministrationProblemGroupsPage;
