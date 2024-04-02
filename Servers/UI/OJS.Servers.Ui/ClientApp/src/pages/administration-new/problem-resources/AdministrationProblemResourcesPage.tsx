import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { IGetAllAdminParams } from '../../../common/types';
import AdministrationModal from '../../../components/administration/common/modals/administration-modal/AdministrationModal';
import ProblemResourceForm from '../../../components/administration/problem-resources/problem-resource-form/ProblemResourceForm';
import { useGetAllAdminProblemResourcesQuery } from '../../../redux/services/admin/problemResourcesAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import { IAdministrationFilter } from '../administration-filters/AdministrationFilters';
import { IAdministrationSorter } from '../administration-sorting/AdministrationSorting';
import AdministrationGridView from '../AdministrationGridView';

import problemResourceFilterableColumns, { returnProblemResourceNonFilterableColumns } from './problemResourcesGridColumns';

const AdministrationProblemResourcesPage = () => {
    const [ searchParams ] = useSearchParams();
    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: searchParams.get('filter') ?? '',
        sorting: searchParams.get('sorting') ?? '',
    });
    const [ openEditModal, setOpenEditModal ] = useState<boolean>(false);
    const [ problemResourceId, setProblemResourceId ] = useState<number>(0);

    const [ selectedFilters, setSelectedFilters ] = useState<Array<IAdministrationFilter>>([]);
    const [ selectedSorters, setSelectedSorters ] = useState<Array<IAdministrationSorter>>([]);

    const { refetch: retakeData, data, error } = useGetAllAdminProblemResourcesQuery(queryParams);
    const filterParams = searchParams.get('filter');
    const sortingParams = searchParams.get('sorting');

    useEffect(() => {
        setQueryParams((prevState) => ({ ...prevState, filter: filterParams ?? '' }));
    }, [ filterParams ]);

    useEffect(() => {
        setQueryParams((prevState) => ({ ...prevState, sorting: sortingParams ?? '' }));
    }, [ sortingParams ]);

    const onEditClick = (id: number) => {
        setOpenEditModal(true);
        setProblemResourceId(id);
    };

    const renderProblemResourceModal = (index: number) => (
        <AdministrationModal
          key={index}
          index={index}
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
        >
            <ProblemResourceForm
              id={problemResourceId}
            />
        </AdministrationModal>
    );
    return (
        <AdministrationGridView
          filterableGridColumnDef={problemResourceFilterableColumns}
          notFilterableGridColumnDef={returnProblemResourceNonFilterableColumns(onEditClick, retakeData)}
          data={data}
          error={error}
          selectedFilters={selectedFilters || []}
          selectedSorters={selectedSorters || []}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          setSorterStateAction={setSelectedSorters}
          setFilterStateAction={setSelectedFilters}
          legendProps={[ { color: '#FFA1A1', message: 'Resource is deleted.' } ]}
          modals={[
              { showModal: openEditModal, modal: (i) => renderProblemResourceModal(i) },
          ]}
        />
    );
};
export default AdministrationProblemResourcesPage;
