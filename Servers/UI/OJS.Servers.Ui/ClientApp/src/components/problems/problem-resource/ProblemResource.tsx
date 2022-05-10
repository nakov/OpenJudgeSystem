import * as React from 'react';
import { useCallback } from 'react';
import { Button } from '../../guidelines/buttons/Button';
import { IProblemResourceType } from '../../../common/types';

import styles from './ProblemResource.module.scss';
import { useProblems } from '../../../hooks/use-problems';

interface IProblemResourceProps {
    resource: IProblemResourceType
}

const resourceTypeToIconClassName : { [name: number]: string } = {
    1: 'fa-file-alt',
    2: 'fa-lightbulb',
    3: 'fa-link',
};

const ProblemResource = ({ resource }: IProblemResourceProps) => {
    const { actions: { downloadProblemResourceFile } } = useProblems();

    const handleDownloadResourceFile = useCallback(async () => {
        await downloadProblemResourceFile(resource.id);
    }, [ downloadProblemResourceFile, resource ]);

    const renderResourceLink = (linkContent: React.ReactNode) => (resource.type === 3
        ? (
            <a
              href={resource.link}
              className={styles.resourceLink}
              target="_blank"
              rel="noreferrer"
            >
                {linkContent}
            </a>
        )
        : (
            <Button
              type="plain"
              className={styles.resourceLinkButton}
              onClick={
                    (e) => {
                        e.preventDefault();
                        handleDownloadResourceFile();
                    }
                }
            >
                {linkContent}
            </Button>
        ));

    const renderResource = () => {
        const resourceTypeIconClassName = resource.type == null
            ? resourceTypeToIconClassName[1]
            : resourceTypeToIconClassName[resource.type];

        const resourceLinkContent = (
            <>
                <i className={`fal ${resourceTypeIconClassName}`} />
                {resource.name}
            </>
        );

        return (
            <div className={styles.resourceWrapper}>
                {renderResourceLink(resourceLinkContent)}
            </div>
        );
    };

    return renderResource();
};

export default ProblemResource;
