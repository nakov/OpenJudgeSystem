import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { IDictionary } from '../../../common/common-types';
import { ISubmissionResponseModel, usePublicSubmissions } from '../../../hooks/submissions/use-public-submissions';
import { useAuth } from '../../../hooks/use-auth';
import { usePages } from '../../../hooks/use-pages';
import { format } from '../../../utils/number-utils';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import List from '../../guidelines/lists/List';
import PaginationControls from '../../guidelines/pagination/PaginationControls';
import SubmissionGridRow from '../submission-grid-row/SubmissionGridRow';

import SubmissionStateLink from './SubmissionStateLink';

import styles from './SubmissionsGrid.module.scss';
import {useHttp} from "../../../hooks/use-http";
import {IGetSubmissionsUrlParams} from "../../../common/url-types";
import {IPagedResultType} from "../../../common/types";
import { getUserSubmissionsUrl } from "../../../utils/urls";

const selectedSubmissionsStateMapping = {
    1: 'All',
    2: 'In Queue',
    3: 'Pending',
} as IDictionary<string>;

enum toggleValues {
    allSubmissions = 'all submissions',
    mySubmissions = 'my submissions',
}

const SubmissionsGrid = () => {
    const [ userSubmissions, setUserSubmissions ] = useState<any>([]);
    const [ selectedActive, setSelectedActive ] = useState<number>(1);
    const [ activeToggleElement, setActiveToggleElement ] = useState<toggleValues>(toggleValues.allSubmissions);

    const {
        state: {
            publicSubmissions,
            unprocessedSubmissions,
            pendingSubmissions,
            totalSubmissionsCount,
            totalUnprocessedSubmissionsCount,
        },
        actions: {
            initiatePublicSubmissionsQuery,
            initiateUnprocessedSubmissionsQuery,
            initiatePendingSubmissionsQuery,
        },
    } = usePublicSubmissions();

    const { state: { user } } = useAuth();

    const selectedSubmissionStateToRequestMapping = useMemo(
        () => ({
            1: initiatePublicSubmissionsQuery,
            2: initiateUnprocessedSubmissionsQuery,
            3: initiatePendingSubmissionsQuery,
        } as IDictionary<() => void>),
        [ initiatePendingSubmissionsQuery, initiatePublicSubmissionsQuery, initiateUnprocessedSubmissionsQuery ],
    );

    const {
        state: { currentPage, pagesInfo },
        changePage,
        clearPageValue,
    } = usePages();

    const {
        get: getUserSubmissions,
        data: userSubmissionsData,
    } = useHttp<
        IGetSubmissionsUrlParams,
        IPagedResultType<ISubmissionResponseModel>>({
        url: getUserSubmissionsUrl,
        parameters: { page: 1 }
    });

    const handlePageChange = useCallback(
        (page: number) => changePage(page),
        [ changePage ],
    );

    useEffect(() => {
        getUserSubmissions();
    }, []);

    useEffect(() => {
        if (activeToggleElement === toggleValues.mySubmissions) {
            // console.log('user submissions => ', userSubmissionsData);
        }
    }, [ activeToggleElement ]);

    const renderSubmissionRow = useCallback(
        (submission: ISubmissionResponseModel) => (
            <SubmissionGridRow submission={submission} />
        ),
        [],
    );

    const handleSelectSubmissionType = useCallback((typeKey: number) => {
        if (selectedActive) {
            clearPageValue();

            setSelectedActive(typeKey);
        }
    }, [ clearPageValue, selectedActive ]);

    const handleToggleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const clickedElement = e.target as HTMLDivElement;
        const { textContent } = clickedElement;

        if (textContent?.toLowerCase() === toggleValues.allSubmissions) {
            setActiveToggleElement(toggleValues.allSubmissions);
        } else {
            setActiveToggleElement(toggleValues.mySubmissions);
        }
    };

    useEffect(
        () => {
            if (totalSubmissionsCount === 0) {
                return;
            }

            selectedSubmissionStateToRequestMapping[selectedActive]();
        },
        [
            initiatePendingSubmissionsQuery,
            initiatePublicSubmissionsQuery,
            initiateUnprocessedSubmissionsQuery,
            selectedActive,
            selectedSubmissionStateToRequestMapping,
            totalSubmissionsCount,
        ],
    );

    const { pagesCount } = pagesInfo;
    const renderPrivilegedComponent = useCallback(
        () => {
            const { isInRole } = user;
            if (isInRole) {
                return (
                    <>
                        <Heading type={HeadingType.secondary}>
                            Submissions awaiting execution:
                            {' '}
                            {totalUnprocessedSubmissionsCount}
                            {' '}
                            (
                            <SubmissionStateLink
                              stateIndex={1}
                              isSelected={selectedActive === 1}
                              text={selectedSubmissionsStateMapping[1]}
                              handleOnSelect={handleSelectSubmissionType}
                            />
                            /
                            <SubmissionStateLink
                              stateIndex={2}
                              isSelected={selectedActive === 2}
                              text={selectedSubmissionsStateMapping[2]}
                              handleOnSelect={handleSelectSubmissionType}
                            />
                            /
                            <SubmissionStateLink
                              stateIndex={3}
                              isSelected={selectedActive === 3}
                              text={selectedSubmissionsStateMapping[3]}
                              handleOnSelect={handleSelectSubmissionType}
                            />
                            )
                        </Heading>
                        <PaginationControls
                          count={pagesCount}
                          page={currentPage}
                          onChange={handlePageChange}
                        />
                    </>
                );
            }

            return null;
        },
        [
            user,
            totalUnprocessedSubmissionsCount,
            selectedActive,
            handleSelectSubmissionType,
            pagesCount,
            currentPage,
            handlePageChange,
        ],
    );

    const renderToggleButton = useCallback(() => (
        <div className={styles.toggleButtonWrapper}>
            <div
                className={`${activeToggleElement === toggleValues.allSubmissions
                    ? styles.activeElement
                    : ''}`}
                onClick={(e) => handleToggleClick(e)}
            >
                ALL SUBMISSIONS
            </div>
            <div
                className={`${activeToggleElement === toggleValues.mySubmissions
                    ? styles.activeElement
                    : ''}`}
                onClick={(e) => handleToggleClick(e)}
            >
                MY SUBMISSIONS
            </div>
        </div>
    ), [ activeToggleElement ]);

    const renderSubmissionsList = useCallback(
        () => {
            const submissions = selectedActive === 1
                ? publicSubmissions
                : selectedActive === 2
                    ? unprocessedSubmissions
                    : pendingSubmissions;

            return (
                <List
                  values={submissions}
                  itemFunc={renderSubmissionRow}
                  itemClassName={styles.submissionRow}
                  fullWidth
                />
            );
        },
        [ pendingSubmissions, publicSubmissions, renderSubmissionRow, selectedActive, unprocessedSubmissions ],
    );

    return (
        <>
            <Heading type={HeadingType.primary}>
                Latest
                {' '}
                {publicSubmissions.length}
                {' '}
                submissions out of
                {' '}
                {format(totalSubmissionsCount)}
                {' '}
                total
            </Heading>
            {renderToggleButton()}
            {renderPrivilegedComponent()}
            {renderSubmissionsList()}
        </>
    );
};

export default SubmissionsGrid;
