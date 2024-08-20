import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { IGetAllAdminParams } from '../../../common/types';
import AdministrationModal from '../../../components/administration/common/modals/administration-modal/AdministrationModal';
import TestForm from '../../../components/administration/tests/test-form/TestForm';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import { useGetAllAdminTestsQuery, useLazyExportTestsToExcelQuery } from '../../../redux/services/admin/testsAdminService';
import { applyDefaultFilterToQueryString } from '../administration-filters/AdministrationFilters';
import AdministrationGridView, { defaultSorterToAdd } from '../AdministrationGridView';

import testsFilterableColums, { returnTestsNonFilterableColumns } from './testsGridColumns';

const AdministrationTestsPage = () => {
    const [ searchParams ] = useSearchParams();
    const [ openEditTestModal, setOpenEditTestModal ] = useState(false);
    const [ testId, setTestId ] = useState<number | null>(null);

    // eslint-disable-next-line max-len
    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>(applyDefaultFilterToQueryString('', defaultSorterToAdd, searchParams));

    const { refetch: retakeTests, data: testsData, isLoading: isLoadingTests, error } = useGetAllAdminTestsQuery(queryParams);

    const onClose = () => {
        retakeTests();
        setOpenEditTestModal(false);
    };

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
          onClose={onClose}
        >
            <TestForm
              id={testId!}
              onSuccess={onClose}
            />
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
                    onSuccessDelete,
                )
            }
          data={testsData}
          error={error}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          modals={[
              { showModal: openEditTestModal, modal: (i) => renderTestEditModal(i) },
          ]}
          excelMutation={useLazyExportTestsToExcelQuery}
        />
    );
};
export default AdministrationTestsPage;
