import { useCallback, useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { IDictionary } from '../../../common/common-types';
import { IGetSubmissionsUrlParams } from '../../../common/url-types';
import { setCurrentPage, setLatestSubmissions } from '../../../redux/features/submissionsSlice';
import {
    useGetLatestSubmissionsQuery,
    useGetUnprocessedCountQuery,
    useLazyGetLatestSubmissionsInRoleQuery,
} from '../../../redux/services/submissionsService';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { flexCenterObjectStyles } from '../../../utils/object-utils';
import Button, { ButtonSize, ButtonType } from '../../guidelines/buttons/Button';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import SpinningLoader from '../../guidelines/spinning-loader/SpinningLoader';
import SubmissionsGrid from '../submissions-grid/SubmissionsGrid';

import SubmissionStateLink from './SubmissionStateLink';

import styles from './RecentSubmissions.module.scss';

const selectedSubmissionsStateMapping = {
    1: 'All',
    2: 'Processing',
    3: 'Enqueued',
    4: 'Pending',
} as IDictionary<string>;

const RecentSubmissions = () => {
    const [ selectedActive, setSelectedActive ] = useState<number>(1);
    const [ shouldLoadRegularUserSubmissions, setShouldLoadRegularUserSubmissions ] = useState<boolean>(false);
    const [ shouldLoadUnprocessedCount, setShouldLoadUnprocessedCount ] = useState<boolean>(false);
    const [ queryParams, setQueryParams ] = useState<IGetSubmissionsUrlParams>({
        status: selectedActive,
        page: 1,
    });

    const appDispatch = useAppDispatch();

    const { latestSubmissions } = useAppSelector((state) => state.submissions);
    const { internalUser: user } = useAppSelector((state) => state.authorization);

    const loggedInUserInRole = !isEmpty(user.id) && user.isAdmin;

    const {
        isLoading: regularUserIsLoading,
        isFetching: regularUserIsFetching,
        data: regularUserData,
    } = useGetLatestSubmissionsQuery(
        queryParams,
        { skip: !shouldLoadRegularUserSubmissions },
    );

    const { data: unprocessedCount } = useGetUnprocessedCountQuery(null, { skip: !shouldLoadUnprocessedCount });

    const [
        getLatestSubmissionsInRole, {
            isLoading: inRoleLoading,
            isFetching: inRoleIsFetching,
            data: inRoleData,
        },
    ] = useLazyGetLatestSubmissionsInRoleQuery();

    useEffect(() => {
        if (loggedInUserInRole) {
            getLatestSubmissionsInRole(queryParams);
        }
    }, [ loggedInUserInRole, getLatestSubmissionsInRole, queryParams ]);

    useEffect(() => {
        if (user.isAdmin) {
            setShouldLoadUnprocessedCount(true);
            return;
        }

        setShouldLoadRegularUserSubmissions(true);
    }, [ user ]);

    const areSubmissionsLoading =
        loggedInUserInRole
            ? inRoleLoading
            : regularUserIsLoading;

    const areSubmissionsFetching =
        loggedInUserInRole
            ? inRoleIsFetching
            : regularUserIsFetching;

    const inRoleSubmissionsReady = loggedInUserInRole && !isNil(inRoleData) && !inRoleLoading && !inRoleIsFetching;
    const regularUserSubmissionsReady = !loggedInUserInRole && !isNil(regularUserData) && !regularUserIsLoading && !regularUserIsFetching;

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

    const renderSubmissionsStateAdminToggle = useCallback(() => {
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
                /
                <SubmissionStateLink
                  stateIndex={4}
                  isSelected={selectedActive === 4}
                  text={selectedSubmissionsStateMapping[4]}
                  handleOnSelect={handleSelectSubmissionState}
                />
                )
                <Button
                  onClick={() => setQueryParams((prev) => ({ ...prev, page: 1 }))}
                  size={ButtonSize.small}
                  type={ButtonType.secondary}
                  text="Refresh"
                />
            </Heading>
            )
        );
    }, [ user, unprocessedCount, selectedActive, handleSelectSubmissionState ]);

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
            {
                areSubmissionsFetching && queryParams.page === 1
                    ? (
                        <div style={{ ...flexCenterObjectStyles, marginTop: '10px' }}>
                            <SpinningLoader />
                        </div>
                    )
                    : (
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
                    )
            }
        </div>
    );
};

export default RecentSubmissions;
