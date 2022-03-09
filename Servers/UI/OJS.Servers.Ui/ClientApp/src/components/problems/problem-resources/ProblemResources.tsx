import * as React from 'react';
import { IProblemResourceType } from '../../../hooks/contests/types';
import List from '../../guidelines/lists/List';
import styles from './ProblemResources.module.scss';

interface IProblemResourcesProps {
    resources: IProblemResourceType[] | undefined
}

const linkTypeToIconClassName : { [name: number]: string } = {
    1: 'fa-file-alt',
    2: 'fa-lightbulb',
    3: 'fa-link',
};

const ProblemResources = ({ resources }: IProblemResourcesProps) => {
    const renderResource = (resource: IProblemResourceType) => {
        const linkIconClassName = resource.type == null
            ? linkTypeToIconClassName[1]
            : linkTypeToIconClassName[resource.type];

        return (
            <div className={styles.resource}>
                <a href="https://judge.softuni.org/">
                    <i className={`fal ${linkIconClassName}`} />
                    {resource.name}
                </a>
            </div>
        );
    };

    return (
        resources == null
            ? <p>No additional resources.</p>
            : (
                <List
                  values={resources}
                  orientation="vertical"
                  itemFunc={renderResource}
                />
            )
    );
};

export default ProblemResources;
