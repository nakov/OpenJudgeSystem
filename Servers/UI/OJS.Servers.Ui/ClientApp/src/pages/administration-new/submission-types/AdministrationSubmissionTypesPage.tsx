import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { IGetAllAdminParams } from '../../../common/types';
import CreateButton from '../../../components/administration/common/create/CreateButton';
import AdministrationModal from '../../../components/administration/common/modals/administration-modal/AdministrationModal';
import SubmissionTypesForm from '../../../components/administration/submission-types/form/SubmissionTypeForm';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import { useGetAllSubmissionTypesQuery, useLazyExportSubmissionTypesToExcelQuery } from '../../../redux/services/admin/submissionTypesAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import { IAdministrationFilter, mapGridColumnsToAdministrationFilterProps, mapUrlToFilters } from '../administration-filters/AdministrationFilters';
import { IAdministrationSorter, mapGridColumnsToAdministrationSortingProps, mapUrlToSorters } from '../administration-sorting/AdministrationSorting';
import AdministrationGridView from '../AdministrationGridView';

import submissionTypesFilterableColumns, { returnNonFilterableColumns } from './submissionTypesGridColumns';

const AdministrationSubmissionTypesPage = () => {
    const [ searchParams ] = useSearchParams();

    const [ showCreateModal, setShowCreateModal ] = useState<boolean>(false);
    const [ showEditModal, setShowEditModal ] = useState<boolean>(false);
    const [ submissionTypeId, setSubmissionTypeId ] = useState<number | null>(null);
    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: searchParams.get('filter') ?? '',
        sorting: searchParams.get('sorting') ?? '',
    });

    const [ selectedFilters, setSelectedFilters ] = useState<Array<IAdministrationFilter>>(mapUrlToFilters(
        searchParams ?? '',
        mapGridColumnsToAdministrationFilterProps(submissionTypesFilterableColumns),
    ));

    const [ selectedSorters, setSelectedSorters ] = useState<Array<IAdministrationSorter>>(mapUrlToSorters(
        searchParams ?? '',
        mapGridColumnsToAdministrationSortingProps(submissionTypesFilterableColumns),
    ));

    const { refetch, data: submissionTypesData, isLoading: isGettingData, error } = useGetAllSubmissionTypesQuery(queryParams);

    useEffect(() => {
        setQueryParams((currentParams) => ({
            ...currentParams,
            filter: searchParams.get('filter') ?? '',
            sorting: searchParams.get('sorting') ?? '',
        }));
    }, [ searchParams ]);

    const onEditClick = (id: number) => {
        setSubmissionTypeId(id);
        setShowEditModal(true);
    };

    if (isGettingData) {
        return <SpinningLoader />;
    }
    const onModalClose = (isEditMode : boolean) => {
        if (isEditMode) {
            setShowEditModal(false);
        } else {
            setShowCreateModal(false);
        }
        refetch();
    };
    const onSuccessFullDelete = () => {
        refetch();
    };

    const renderFormModal = (index: number, isEditMode: boolean) => (
        <AdministrationModal
          key={index}
          index={index}
          open={isEditMode
              ? showEditModal
              : showCreateModal}
          onClose={() => onModalClose(isEditMode)}
        >
            <SubmissionTypesForm id={submissionTypeId} isEditMode={isEditMode} />
        </AdministrationModal>
    );

    const renderGridSettings = () => (
        <CreateButton
          showModal={showCreateModal}
          showModalFunc={setShowCreateModal}
          styles={{ width: '40px', height: '40px', color: 'rgb(25,118,210)' }}
        />
    );

    return (
        <AdministrationGridView
          filterableGridColumnDef={submissionTypesFilterableColumns}
          notFilterableGridColumnDef={returnNonFilterableColumns(onEditClick, onSuccessFullDelete)}
          data={submissionTypesData}
          error={error}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          selectedFilters={selectedFilters || []}
          selectedSorters={selectedSorters || []}
          setSorterStateAction={setSelectedSorters}
          setFilterStateAction={setSelectedFilters}
          modals={[
              { showModal: showEditModal, modal: (i) => renderFormModal(i, true) },
              { showModal: showCreateModal, modal: (i) => renderFormModal(i, false) },
          ]}
          renderActionButtons={renderGridSettings}
          excelMutation={useLazyExportSubmissionTypesToExcelQuery}
        />
    );
};
export default AdministrationSubmissionTypesPage;
