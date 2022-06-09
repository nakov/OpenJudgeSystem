import * as React from 'react';
import { IProblemResourceType } from '../../../common/types';
import List from '../../guidelines/lists/List';
import ProblemResource from '../problem-resource/ProblemResource';
import styles from './ProblemResources.module.scss';
import concatClassNames from '../../../utils/class-names';

interface IProblemResourcesProps {
    resources: IProblemResourceType[] | undefined
}

const ProblemResources = ({ resources }: IProblemResourcesProps) => {
    const renderResource = (resource: IProblemResourceType) => (<ProblemResource resource={resource} />);
    const contestResourcesClass = 'contestResources';
    const contestResourcesClassName = concatClassNames(styles.resourcesList, contestResourcesClass);
    return (
        resources == null
            ? <p>No additional resources.</p>
            : (
                <List
                  values={resources}
                  orientation="vertical"
                  itemFunc={renderResource}
                  className={contestResourcesClassName}
                />
            )
    );
};

export default ProblemResources;
