import React from 'react';

import AdministrationGridView from '../../../../../pages/administration-new/AdministrationGridView';
import problemResourceFilterableColumns, { returnProblemResourceNonFilterableColumns } from '../../../../../pages/administration-new/problem-resources/problemResourcesGridColumns';
import { useGetResourcesQuery } from '../../../../../redux/services/admin/problemsAdminService';
import SpinningLoader from '../../../../guidelines/spinning-loader/SpinningLoader';

interface IResourceInproblemViewProps {
problemId: number;
}
const ResourcesInProblemView = (props : IResourceInproblemViewProps) => {
    const { problemId } = props;

    const {
        data: resourcesData,
        isLoading: isGettingResources,
        error: resourcesError,
    } = useGetResourcesQuery(Number(problemId));

    const onEditClick = () => {
        console.log('Edit clicked');
    };

    if (isGettingResources) {
        return <SpinningLoader />;
    }
    return (
        <AdministrationGridView
          filterableGridColumnDef={problemResourceFilterableColumns}
          notFilterableGridColumnDef={returnProblemResourceNonFilterableColumns(onEditClick)}
          data={resourcesData}
          error={resourcesError}
          selectedFilters={[]}
          selectedSorters={[]}
          showFiltersAndSorters={false}
          location=""
          legendProps={[ { color: '#FFA1A1', message: 'Problem Resource is deleted.' } ]}
        />
    );
};

export default ResourcesInProblemView;
