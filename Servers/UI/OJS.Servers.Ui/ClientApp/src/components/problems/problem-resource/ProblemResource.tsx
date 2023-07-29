import React, { FC, useCallback } from 'react';
import isNil from 'lodash/isNil';

import { IProblemResourceType } from '../../../common/types';
import { useProblems } from '../../../hooks/use-problems';
import { Button, ButtonType } from '../../guidelines/buttons/Button';
import IconSize from '../../guidelines/icons/common/icon-sizes';
import FileIcon from '../../guidelines/icons/FileIcon';
import { IIconProps } from '../../guidelines/icons/Icon';
import LightbulbIcon from '../../guidelines/icons/LightbulbIcon';
import LinkIcon from '../../guidelines/icons/LinkIcon';

import styles from './ProblemResource.module.scss';

interface IProblemResourceProps {
    resource: IProblemResourceType;
}

const resourceTypeToIcon : { [name: number]: FC<IIconProps> } = {
    1: FileIcon,
    2: LightbulbIcon,
    3: LinkIcon,
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

    const getResourceLinkContent = useCallback(() => {
        const Icon = resourceTypeToIcon[resource.type] || null;

        if (isNil(Icon)) {
            return null;
        }

        return (
            <div className={styles.iconAndNameContainer}>
                <div className={styles.icon}>
                    <Icon size={IconSize.Medium} />
                </div>
                <div>
                    <span>{resource.name}</span>
                </div>
            </div>
        );
    }, [ resource.name, resource.type ]);

    return (
        <div className={styles.resourceWrapper}>
            {renderResourceLink(getResourceLinkContent())}
        </div>
    );
};

export default ProblemResource;
