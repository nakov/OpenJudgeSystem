import React, { useCallback } from 'react';

import { isNil } from 'lodash';

import concatClassNames from '../../../utils/class-names';
import { IProblemResourceType } from '../../code-editor/common/types';

import List from '../../guidelines/lists/List';
import ProblemResource from '../problem-resource/ProblemResource';

import { useProblems } from '../../../hooks/use-problems';

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
