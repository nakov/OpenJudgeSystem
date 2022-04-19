import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { useHomeContests } from '../../../hooks/use-home-contests';
import { Button } from '../../guidelines/buttons/Button';
import { IProblemResourceType } from '../../../common/types';

import styles from './ProblemResource.module.scss';

interface IProblemResourceProps {
    resource: IProblemResourceType
}

const resourceTypeToIconClassName : { [name: number]: string } = {
    1: 'fa-file-alt',
    2: 'fa-lightbulb',
    3: 'fa-link',
};

const ProblemResource = ({ resource }: IProblemResourceProps) => {
    const {
        actions: {
            getProblemResourceFile,
            getProblemResourceResponse,
        },
    } = useHomeContests();

    const saveFile = useCallback(() => {
        if (!getProblemResourceResponse) {
            return;
        }

        // todo: move this to http helper
        const filename = getProblemResourceResponse
            .headers['content-disposition']
            .split('filename*=UTF-8\'\'')[1];

        const filenameDecoded = decodeURIComponent(filename);

        saveAs(
            getProblemResourceResponse.data,
            filenameDecoded,
        );
    }, [ getProblemResourceResponse ]);

    const onClickGetResourceFile = useCallback(async () => {
        await getProblemResourceFile(resource.id);
    }, [ getProblemResourceFile, resource ]);

    useEffect(() => {
        saveFile();
    }, [ getProblemResourceResponse, saveFile ]);

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
                            onClickGetResourceFile();
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
