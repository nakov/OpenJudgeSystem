import React, { useCallback } from 'react';
import isNil from 'lodash/isNil';

import { IProblemResourceType } from '../../../common/types';
import { useProblems } from '../../../hooks/use-problems';
import concatClassNames from '../../../utils/class-names';
import List from '../../guidelines/lists/List';
import ProblemResource from '../problem-resource/ProblemResource';

import styles from './ProblemResources.module.scss';

const ProblemResources = () => {
    const { state: { currentProblem } } = useProblems();

    const { resources } = currentProblem || {};

    const renderResource = useCallback(
        (resource: IProblemResourceType) => (<ProblemResource resource={resource} />),
        [],
    );

    const contestResourcesClass = 'contestResources';
    const contestResourcesClassName = concatClassNames(styles.resourcesList, contestResourcesClass);

    if (isNil(resources)) {
        return (<p>No additional resources.</p>);
    }

    return (
        <List
          values={resources}
          itemFunc={renderResource}
          className={contestResourcesClassName}
        />
    );
};

export default ProblemResources;
