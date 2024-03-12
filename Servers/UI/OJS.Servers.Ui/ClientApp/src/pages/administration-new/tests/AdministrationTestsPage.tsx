import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { IGetAllAdminParams, IRootStore } from '../../../common/types';
import AdministrationModal from '../../../components/administration/common/modals/administration-modal/AdministrationModal';
import TestForm from '../../../components/administration/tests/test-form/TestForm';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import { setAdminTestsFilters, setAdminTestsSorters } from '../../../redux/features/admin/testsSlice';
import { useDeleteTestMutation, useGetAllAdminTestsQuery } from '../../../redux/services/admin/testsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
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
    const selectedFilters = useSelector((state: IRootStore) => state.adminTests['all-tests']?.selectedFilters);
    const selectedSorters = useSelector((state: IRootStore) => state.adminTests['all-tests']?.selectedSorters);
    const { data: testsData, isLoading: isLoadingTests, error } = useGetAllAdminTestsQuery(queryParams);

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
                )
}
          data={testsData}
          error={error}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          selectedFilters={selectedFilters || []}
          selectedSorters={selectedSorters || []}
          setFilterStateAction={setAdminTestsFilters}
          setSorterStateAction={setAdminTestsSorters}
          location="all-tests"
          modals={[
              { showModal: openEditTestModal, modal: (i) => renderTestEditModal(i) },
          ]}
        />
    );
};
export default AdministrationTestsPage;
