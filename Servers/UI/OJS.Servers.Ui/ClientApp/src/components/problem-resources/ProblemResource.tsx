import React, { useEffect } from 'react';
import { IoDocumentText } from 'react-icons/io5';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { IProblemResourceType } from '../../common/types';
import { LOGIN_PATH } from '../../common/urls/client-urls';
import { useLazyDownloadContestProblemResourceQuery } from '../../redux/services/contestsService';
import downloadFile from '../../utils/file-download-utils';

import styles from './ProblemResource.module.scss';

interface IProblemResourceProps {
    resource: IProblemResourceType;
    problem: string;
}

const ProblemResource = ({ resource, problem }: IProblemResourceProps) => {
    const { link, name: linkName, id } = resource;
    const navigate = useNavigate();
    const location = useLocation();

    const [ downloadResourceFile, {
        data: problemResourceDownloadData,
        isError: problemResourceDownloadError,
        isLoading: problemResourceDownloadIsLoading,
    } ] = useLazyDownloadContestProblemResourceQuery();

    useEffect(() => {
        if (!problemResourceDownloadData) {
            return;
        }

        downloadFile(problemResourceDownloadData.blob, problemResourceDownloadData.fileName);
    }, [ problem, problemResourceDownloadData ]);

    // eslint-disable-next-line consistent-return
    useEffect(() => {
        if (problemResourceDownloadError) {
            const timeout = setTimeout(() => {
                navigate(`/${LOGIN_PATH}`, { state: { from: location } });
            }, 5000);

            return () => clearTimeout(timeout);
        }
    }, [ problemResourceDownloadError, navigate, location ]);

    return (
        <>
            {
                resource.link
                    ? (
                        <Link key={`resource-problem-${id}`} className={styles.resourceElement} target="_blank" to={link}>
                            <IoDocumentText size={20} />
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
                            <IoDocumentText size={20} />
                            {linkName}
                        </div>
                    )
            }
            {problemResourceDownloadError || problemResourceDownloadIsLoading
                ? (
                    <div className={styles.problemResourceIndicator}>
                        {problemResourceDownloadError
                            ? (
                                <div className={styles.problemResourceDownloadError}>
                                    Unable to download the resource because you are not logged in. Please log in and try again.
                                </div>
                            )
                            : ''}
                        {problemResourceDownloadIsLoading
                            ? <div className={styles.problemResourceLoading}>Downloading resource...</div>
                            : ''}
                    </div>
                )
                : null}
        </>
    );
};

export default ProblemResource;
