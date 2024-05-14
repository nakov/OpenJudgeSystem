import { useCallback, useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { IDictionary } from '../../../common/common-types';
import { IGetSubmissionsUrlParams } from '../../../common/url-types';
import { setCurrentPage, setLatestSubmissions } from '../../../redux/features/submissionsSlice';
import {
    useGetLatestSubmissionsInRoleQuery,
    useGetLatestSubmissionsQuery,
    useGetUnprocessedCountQuery,
} from '../../../redux/services/submissionsService';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import SubmissionsGrid from '../submissions-grid/SubmissionsGrid';

import SubmissionStateLink from './SubmissionStateLink';

import styles from './RecentSubmissions.module.scss';

const selectedSubmissionsStateMapping = {
    1: 'All',
    2: 'In Queue',
    3: 'Pending',
} as IDictionary<string>;

const RecentSubmissions = () => {
    const [ selectedActive, setSelectedActive ] = useState<number>(1);
    const [ shouldLoadRegularUserSubmissions, setShouldLoadRegularUserSubmissions ] = useState<boolean>(false);
    const [ shouldLoadAdminUserSubmissions, setShouldLoadAdminUserSubmissions ] = useState<boolean>(false);
    const [ shouldLoadUnprocessedCount, setShouldLoadUnprocessedCount ] = useState<boolean>(false);
    const [ queryParams, setQueryParams ] = useState<IGetSubmissionsUrlParams>({
        status: selectedActive,
        page: 1,
    });

    const appDispatch = useAppDispatch();

    const {
        latestSubmissions,
        currentPage,
    } = useAppSelector((state) => state.submissions);

    const { internalUser: user } = useAppSelector((state) => state.authorization);

    const loggedInUserInRole = !isEmpty(user.id) && user.isAdmin;

    const {
        isLoading: regularUserIsLoading,
        data: regularUserData,
    } = useGetLatestSubmissionsQuery(
        { status: selectedActive, page: currentPage },
        { skip: !shouldLoadRegularUserSubmissions },
    );

    const { data: unprocessedCount } = useGetUnprocessedCountQuery(null, { skip: !shouldLoadUnprocessedCount });

    const {
        isLoading: inRoleLoading,
        data: inRoleData,
    } = useGetLatestSubmissionsInRoleQuery(
        queryParams,
        { skip: !shouldLoadAdminUserSubmissions },
    );

    useEffect(() => {
        if (user.isAdmin) {
            setShouldLoadAdminUserSubmissions(true);
            setShouldLoadUnprocessedCount(true);
            return;
        }

        setShouldLoadRegularUserSubmissions(true);
    }, [ user ]);

    const areSubmissionsLoading =
        loggedInUserInRole
            ? inRoleLoading
            : regularUserIsLoading;

    const inRoleSubmissionsReady = loggedInUserInRole && !isNil(inRoleData) && !areSubmissionsLoading;

    const regularUserSubmissionsReady = !loggedInUserInRole && !isNil(regularUserData) && !areSubmissionsLoading;

    useEffect(() => {
        if (inRoleSubmissionsReady) {
            appDispatch(setLatestSubmissions(inRoleData));
            return;
        }

        if (regularUserSubmissionsReady) {
            appDispatch(setLatestSubmissions(regularUserData));
        }
    }, [ appDispatch, inRoleData, inRoleSubmissionsReady, regularUserData, regularUserSubmissionsReady ]);

    const handlePageChange = useCallback(
        (newPage: number) => {
            setQueryParams({
                status: queryParams.status,
                page: newPage,
            });

            appDispatch(setCurrentPage(newPage));
        },
        [ appDispatch, queryParams.status ],
    );

    const handleSelectSubmissionState = useCallback(
        (typeKey: number) => {
            if (selectedActive) {
                appDispatch(setCurrentPage(1));

                setQueryParams({
                    status: typeKey,
                    page: 1,
                });

                setSelectedActive(typeKey);
            }
        },
        [ appDispatch, selectedActive ],
    );

    const renderSubmissionsStateAdminToggle = useCallback(
        () => {
            const { isAdmin } = user;

            return (
                isAdmin && (
                    <Heading
                      type={HeadingType.secondary}
                    >
                        Submissions awaiting execution:
                        {' '}
                        {unprocessedCount}
                        {' '}
                        (
                        <SubmissionStateLink
                          stateIndex={1}
                          isSelected={selectedActive === 1}
                          text={selectedSubmissionsStateMapping[1]}
                          handleOnSelect={handleSelectSubmissionState}
                        />
                        /
                        <SubmissionStateLink
                          stateIndex={2}
                          isSelected={selectedActive === 2}
                          text={selectedSubmissionsStateMapping[2]}
                          handleOnSelect={handleSelectSubmissionState}
                        />
                        /
                        <SubmissionStateLink
                          stateIndex={3}
                          isSelected={selectedActive === 3}
                          text={selectedSubmissionsStateMapping[3]}
                          handleOnSelect={handleSelectSubmissionState}
                        />
                        )
                    </Heading>
                )
            );
        },
        [ user, unprocessedCount, selectedActive, handleSelectSubmissionState ],
    );

    return (
        <div className={styles.recentSubmissionsWrapper}>
            {
                !user.canAccessAdministration && (
                    <Heading
                      type={HeadingType.primary}
                    >
                        Latest
                        {' '}
                        {latestSubmissions.items?.length}
                        {' '}
                        submissions out of
                        {' '}
                        {isNil(latestSubmissions.totalItemsCount)
                            ? '...'
                            : latestSubmissions.totalItemsCount }
                        {' '}
                        total
                    </Heading>
                )
            }
            {renderSubmissionsStateAdminToggle()}
            <SubmissionsGrid
              className={styles.recentSubmissionsGrid}
              isDataLoaded={!areSubmissionsLoading}
              submissions={latestSubmissions}
              handlePageChange={handlePageChange}
              options={{
                  showDetailedResults: user.isAdmin,
                  showTaskDetails: true,
                  showCompeteMarker: user.isAdmin,
                  showSubmissionTypeInfo: true,
                  showParticipantUsername: true,
              }}
            />
        </div>
    );
};

export default RecentSubmissions;
