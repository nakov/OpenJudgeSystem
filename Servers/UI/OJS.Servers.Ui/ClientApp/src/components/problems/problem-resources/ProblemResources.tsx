import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { IProblemResourceType } from '../../../hooks/contests/types';
import List from '../../guidelines/lists/List';
import styles from './ProblemResources.module.scss';
import { useContests } from '../../../hooks/contests/use-contests';

interface IProblemResourcesProps {
    resources: IProblemResourceType[] | undefined
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const resourceTypeToTypeName : { [name: number]: string } = {
    1: 'Problem Description',
    2: 'Authors Solution',
    3: 'Link',
};

const resourceTypeToIconClassName : { [name: number]: string } = {
    1: 'fa-file-alt',
    2: 'fa-lightbulb',
    3: 'fa-link',
};

const ProblemResources = ({ resources }: IProblemResourcesProps) => {
    const { gerProblemResourceFile, getProblemResourceResponse } = useContests();

    const getFileResource = useCallback(async (resource: IProblemResourceType) => {
        await gerProblemResourceFile(resource.id);
    }, [ gerProblemResourceFile ]);

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

    useEffect(() => {
        saveFile();
    }, [ getProblemResourceResponse, saveFile ]);

    const renderResource = (resource: IProblemResourceType) => {
        const resourceTypeIconClassName = resource.type == null
            ? resourceTypeToIconClassName[1]
            : resourceTypeToIconClassName[resource.type];

        return (
            <div className={styles.resourceWrapper}>
                <a
                  href="https://judge.softuni.org/"
                  className={styles.resourceLink}
                  onClick={(e) => {
                      e.preventDefault();
                      getFileResource(resource);
                  }}
                >
                    <i className={`fal ${resourceTypeIconClassName}`} />
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
                  className={styles.resourcesList}
                />
            )
    );
};

export default ProblemResources;
