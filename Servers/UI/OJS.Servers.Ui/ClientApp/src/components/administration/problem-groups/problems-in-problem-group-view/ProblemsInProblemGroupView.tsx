import React from 'react';

import AdministrationGridView from '../../../../pages/administration-new/AdministrationGridView';

interface IProblemsInProblemGroupViewProps {
    problemGroupId: number;
}

const ProblemsInProblemGroupView = (props: IProblemsInProblemGroupViewProps) => {
    const { problemGroupId } = props;
    return (
        <AdministrationGridView
          data={}
          filterableGridColumnDef={}
          notFilterableGridColumnDef={}
          location=''
          error={}
          
        />
    );
};
