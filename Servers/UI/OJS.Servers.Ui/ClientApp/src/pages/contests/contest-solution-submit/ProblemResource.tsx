import React, { useEffect } from 'react';
import { IoDocumentText } from 'react-icons/io5';
import { Link } from 'react-router-dom';

import { IProblemResourceType } from '../../../common/types';
import { useLazyDownloadContestProblemResourceQuery } from '../../../redux/services/contestsService';
import downloadFile from '../../../utils/file-download-utils';

import styles from './ProblemResource.module.scss';

interface IProblemResourceProps {
    resource: IProblemResourceType;
    problem: string;
}

const ProblemResource = ({ resource, problem }: IProblemResourceProps) => {
    const { link, name: linkName, id } = resource;

    const [ downloadResourceFile, {
        data: problemResourceDownloadData,
        isError: problemResourceDownloadError,
        isLoading: problemResourceDownloadIsLoading,
    } ] = useLazyDownloadContestProblemResourceQuery();

    useEffect(() => {
        if (!problemResourceDownloadData) {
            return;
        }

        downloadFile(problemResourceDownloadData.blob, `${problem}-resources`);
    }, [ problem, problemResourceDownloadData ]);

    return (
        <>
            <div className={styles.problemResourceIndicator}>
                {problemResourceDownloadError
                    ? (
                        <div className={styles.problemResourceDownloadError}>
                            Error downloading problem resource. Please try
                            again!
                        </div>
                    )
                    : ''}
                {problemResourceDownloadIsLoading
                    ? <div className={styles.problemResourceLoading}>Downloading resource...</div>
                    : ''}
            </div>
            {
                resource.link
                    ? (
                        <Link key={`resource-problem-${id}`} className={styles.resourceElement} target="_blank" to={link}>
                            <IoDocumentText />
                            {' '}
                            {linkName}
                        </Link>
                    )
                    : (
                        <div
                          key={`resource-problem-${id}`}
                          className={styles.resourceElement}
                          onClick={() => downloadResourceFile({ id })}
                        >
                            <IoDocumentText />
                            {linkName}
                        </div>
                    )
            }
        </>
    );
};

export default ProblemResource;
