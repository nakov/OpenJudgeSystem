import React, { useCallback, useMemo } from 'react';

import { IProblemResourceType } from '../../../common/types';
import { useProblems } from '../../../hooks/use-problems';
import concatClassNames from '../../../utils/class-names';
import { Button, ButtonType } from '../../guidelines/buttons/Button';

import styles from './ProblemResource.module.scss';

interface IProblemResourceProps {
    resource: IProblemResourceType;
}

// TODO: These should be extracted into `Icons`
const resourceTypeToIconClassName : { [name: number]: string } = {
    1: 'fas fa-file-alt',
    2: 'fas fa-lightbulb',
    3: 'fas fa-link',
};

const ProblemResource = ({ resource }: IProblemResourceProps) => {
    const { actions: { downloadProblemResourceFile } } = useProblems();

    const handleDownloadResourceFile = useCallback(async () => {
        await downloadProblemResourceFile(resource.id);
    }, [ downloadProblemResourceFile, resource ]);

    const renderResourceLink = useCallback((linkContent: React.ReactNode) => (resource.type === 3
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
              type={ButtonType.plain}
              className={styles.resourceLinkButton}
              onClick={() => handleDownloadResourceFile()}
            >
                {linkContent}
            </Button>
        )), [ handleDownloadResourceFile, resource ]);

    const resourceTypeIconClassName = useMemo(
        () => resource.type == null
            ? resourceTypeToIconClassName[1]
            : resourceTypeToIconClassName[resource.type],
        [ resource.type ],
    );

    const resourceIconClassName = useMemo(
        () => concatClassNames(styles.icon, resourceTypeIconClassName),
        [ resourceTypeIconClassName ],
    );

    const getResourceLinkContent = useCallback(() => (
        <div className={styles.resourceLink}>
            <i className={resourceIconClassName} />
            <div>{resource.name}</div>
        </div>
    ), [ resource.name, resourceIconClassName ]);

    return (
        <div className={styles.resourceWrapper}>
            {renderResourceLink(getResourceLinkContent())}
        </div>
    );
};

export default ProblemResource;
