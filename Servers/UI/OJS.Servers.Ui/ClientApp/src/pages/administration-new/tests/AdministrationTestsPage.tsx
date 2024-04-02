import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { IGetAllAdminParams } from '../../../common/types';
import AdministrationModal from '../../../components/administration/common/modals/administration-modal/AdministrationModal';
import TestForm from '../../../components/administration/tests/test-form/TestForm';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import { useDeleteTestMutation, useGetAllAdminTestsQuery } from '../../../redux/services/admin/testsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import { IAdministrationFilter } from '../administration-filters/AdministrationFilters';
import { IAdministrationSorter } from '../administration-sorting/AdministrationSorting';
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
    const [ selectedFilters, setSelectedFilters ] = useState<Array<IAdministrationFilter>>([]);
    const [ selectedSorters, setSelectedSorters ] = useState<Array<IAdministrationSorter>>([]);

    const { refetch: retakeTests, data: testsData, isLoading: isLoadingTests, error } = useGetAllAdminTestsQuery(queryParams);

    const filterParams = searchParams.get('filter');
    const sortingParams = searchParams.get('sorting');

    useEffect(() => {
        setQueryParams((prevState) => ({ ...prevState, filter: filterParams ?? '' }));
    }, [ filterParams ]);

    useEffect(() => {
        setQueryParams((prevState) => ({ ...prevState, sorting: sortingParams ?? '' }));
    }, [ sortingParams ]);

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
