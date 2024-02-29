import React from 'react';

import { IGetAllAdminParams } from '../../../../common/types';
import AdministrationGridView from '../../../../pages/administration-new/AdministrationGridView';
import problemFilterableColums from '../../../../pages/administration-new/problems/problemGridColumns';
import { useGetByProblemGroupIdQuery } from '../../../../redux/services/admin/problemsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../../utils/constants';

interface IProblemsInProblemGroupViewProps {
    problemGroupId: number;
}

const ProblemsInProblemGroupView = (props: IProblemsInProblemGroupViewProps) => {
    const { problemGroupId } = props;

    const queryParams: IGetAllAdminParams = {
        page: 1,
        ItemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: '',
        sorting: '',
    };

    const {
        data: problemData,
        error: problemDataError,
    } = useGetByProblemGroupIdQuery({ problemGroupId: Number(problemGroupId), ...queryParams });

    return (
        <AdministrationGridView
          filterableGridColumnDef={problemFilterableColums}
          notFilterableGridColumnDef={[]}
          data={problemData}
          error={problemDataError}
          selectedFilters={[]}
          selectedSorters={[]}
          showFiltersAndSorters={false}
          location=""
          legendProps={[ { color: '#FFA1A1', message: 'Problem is deleted.' } ]}
        />
    );
};
export default ProblemsInProblemGroupView;
