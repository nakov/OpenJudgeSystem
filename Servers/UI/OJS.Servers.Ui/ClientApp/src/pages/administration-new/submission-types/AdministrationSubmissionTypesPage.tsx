import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { useSearchParams } from 'react-router-dom';

import { IGetAllAdminParams, IRootStore } from '../../../common/types';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import { setAdminSUbmissionTypesFilters, setAdminSUbmissionTypesSorters } from '../../../redux/features/admin/submissionTypesAdminSlice';
import { useGetAllSubmissionTypesQuery } from '../../../redux/services/admin/submissionTypesAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import AdministrationGridView from '../AdministrationGridView';

import submissionTypesFilterableColumns, { returnNonFilterableColumns } from './submissionTypesGridColumns';

const location = 'all-submission-types';
const AdministrationSubmissionTypesPage = () => {
    const [ searchParams ] = useSearchParams();

    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: searchParams.get('filter') ?? '',
        sorting: searchParams.get('sorting') ?? '',
    });

    const { data: submissionTypesData, isLoading: isGettingData, error } = useGetAllSubmissionTypesQuery(queryParams);
    const selectedFilters = useSelector((state: IRootStore) => state.adminSubmissionTypes[location]?.selectedFilters);
    const selectedSorters = useSelector((state: IRootStore) => state.adminSubmissionTypes[location]?.selectedSorters);

    const filterParams = searchParams.get('filter');
    const sortingParams = searchParams.get('sorting');

    useEffect(() => {
        setQueryParams((currentParams) => ({ ...currentParams, filter: filterParams ?? '' }));
    }, [ filterParams ]);

    useEffect(() => {
        setQueryParams((currentParams) => ({ ...currentParams, sorting: sortingParams ?? '' }));
    }, [ sortingParams ]);

    const onEditClick = (id: number) => {
        console.log(`Edit clicked.${id}`);
    };

    if (isGettingData) {
        return <SpinningLoader />;
    }

    return (
        <AdministrationGridView
          filterableGridColumnDef={submissionTypesFilterableColumns}
          notFilterableGridColumnDef={returnNonFilterableColumns(onEditClick)}
          data={submissionTypesData}
          error={error}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          selectedFilters={selectedFilters || []}
          selectedSorters={selectedSorters || []}
          setFilterStateAction={setAdminSUbmissionTypesFilters}
          setSorterStateAction={setAdminSUbmissionTypesSorters}
          location={location}
        />
    );
};
export default AdministrationSubmissionTypesPage;
