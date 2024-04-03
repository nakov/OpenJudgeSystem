import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { IGetAllAdminParams } from '../../../common/types';
import AdministrationModal from '../../../components/administration/common/modals/administration-modal/AdministrationModal';
import TestForm from '../../../components/administration/tests/test-form/TestForm';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import { useDeleteTestMutation, useGetAllAdminTestsQuery } from '../../../redux/services/admin/testsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import { IAdministrationFilter, mapGridColumnsToAdministrationFilterProps, mapUrlToFilters } from '../administration-filters/AdministrationFilters';
import { IAdministrationSorter, mapGridColumnsToAdministrationSortingProps, mapUrlToSorters } from '../administration-sorting/AdministrationSorting';
import AdministrationGridView from '../AdministrationGridView';

import testsFilterableColums, { returnTestsNonFilterableColumns } from './testsGridColumns';

const AdministrationTestsPage = () => {
    const [ searchParams ] = useSearchParams();
    const [ openEditTestModal, setOpenEditTestModal ] = useState(false);
    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: searchParams.get('filter') ?? '',
        sorting: searchParams.get('sorting') ?? '',
    });
    const [ testId, setTestId ] = useState<number | null>(null);
    const [ selectedFilters, setSelectedFilters ] = useState<Array<IAdministrationFilter>>(mapUrlToFilters(
        searchParams ?? '',
        mapGridColumnsToAdministrationFilterProps(testsFilterableColums),
    ));

    const [ selectedSorters, setSelectedSorters ] = useState<Array<IAdministrationSorter>>(mapUrlToSorters(
        searchParams ?? '',
        mapGridColumnsToAdministrationSortingProps(testsFilterableColums),
    ));

    const { refetch: retakeTests, data: testsData, isLoading: isLoadingTests, error } = useGetAllAdminTestsQuery(queryParams);

    useEffect(() => {
        setQueryParams((currentParams) => ({
            ...currentParams,
            filter: searchParams.get('filter') ?? '',
            sorting: searchParams.get('sorting') ?? '',
        }));
    }, [ searchParams ]);

    const onEditClick = (id: number) => {
        setTestId(id);
        setOpenEditTestModal(true);
    };

    const onSuccessDelete = () => {
        retakeTests();
    };

    const renderTestEditModal = (index: number) => (
        <AdministrationModal
          key={index}
          index={index}
          open={openEditTestModal}
          onClose={() => setOpenEditTestModal(false)}
        >
            <TestForm id={testId!} />
        </AdministrationModal>
    );

    if (isLoadingTests) {
        return <SpinningLoader />;
    }

    return (
        <AdministrationGridView
          filterableGridColumnDef={testsFilterableColums}
          notFilterableGridColumnDef={
                returnTestsNonFilterableColumns(
                    onEditClick,
                    useDeleteTestMutation,
                    onSuccessDelete,
                )
}
          data={testsData}
          error={error}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          selectedFilters={selectedFilters || []}
          selectedSorters={selectedSorters || []}
          setSorterStateAction={setSelectedSorters}
          setFilterStateAction={setSelectedFilters}
          modals={[
              { showModal: openEditTestModal, modal: (i) => renderTestEditModal(i) },
          ]}
        />
    );
};
export default AdministrationTestsPage;
