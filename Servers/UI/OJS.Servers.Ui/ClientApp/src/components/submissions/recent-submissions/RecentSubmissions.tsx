import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { IDictionary } from '../../../common/common-types';
import { IRecentSubmissionsReduxState } from '../../../common/types';
import { IGetSubmissionsUrlParams } from '../../../common/url-types';
import { IAuthorizationReduxState } from '../../../redux/features/authorizationSlice';
import { setCurrentPage } from '../../../redux/features/submissionDetailsSlice';
import { setSubmissions } from '../../../redux/features/submissionsSlice';
import {
    useGetLatestSubmissionsInRoleQuery,
    useGetLatestSubmissionsQuery, useGetTotalCountQuery,
} from '../../../redux/services/submissionsService';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import SubmissionsGrid from '../submissions-grid/SubmissionsGrid';

import SubmissionStateLink from './SubmissionStateLink';

const selectedSubmissionsStateMapping = {
    1: 'All',
    2: 'In Queue',
    3: 'Pending',
} as IDictionary<string>;

const defaultState = { state: { selectedActive: 1 } };

const RecentSubmissions = () => {
    const [ selectedActive, setSelectedActive ] = useState<number>(defaultState.state.selectedActive);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ onPageCurrentPage, setOnPageCurrentPage ] = useState<number>(1);
    const [ queryParams, setQueryParams ] = useState<IGetSubmissionsUrlParams>({
        status: selectedActive,
        page: onPageCurrentPage,
    });

    const dispatch = useDispatch();

    const { submissions } = useSelector((state: { latestSubmissions: IRecentSubmissionsReduxState }) => state.latestSubmissions);

    const { internalUser: user } =
        useSelector((state: { authorization: IAuthorizationReduxState }) => state.authorization);

    const loggedInUserInRole = !isEmpty(user.id) && user.isAdmin;

    const {
        isLoading: regularUserIsLoading,
        data: regularUserData,
    } = useGetLatestSubmissionsQuery(
        queryParams,
        { skip: loggedInUserInRole },
    );

    const { data: totalSubmissionsCount } = useGetTotalCountQuery(null);

    const {
        isLoading: inRoleLoading,
        data: inRoleData,
    } = useGetLatestSubmissionsInRoleQuery(
        queryParams,
        { skip: !loggedInUserInRole },
    );

    const areSubmissionsLoading =
        loggedInUserInRole
            ? inRoleLoading
            : regularUserIsLoading;

    const inRoleSubmissionsReady = loggedInUserInRole && !isNil(inRoleData) && !areSubmissionsLoading;

    const regularUserSubmissionsReady = !loggedInUserInRole && !isNil(regularUserData) && !areSubmissionsLoading;

    useEffect(() => {
        if (inRoleSubmissionsReady) {
            dispatch(setSubmissions(inRoleData));
            return;
        }

        if (regularUserSubmissionsReady) {
            dispatch(setSubmissions(regularUserData));
        }
    }, [ dispatch, inRoleData, inRoleSubmissionsReady, regularUserData, regularUserSubmissionsReady ]);

    const handlePageChange = useCallback(
        (newPage: number) => {
            setQueryParams({
                status: queryParams.status,
                page: newPage,
            });
        },
        [ queryParams ],
    );

    const handleSelectSubmissionState = useCallback(
        (typeKey: number) => {
            if (selectedActive) {
                dispatch(setCurrentPage(1));

                setQueryParams({
                    status: queryParams.status,
                    page: typeKey,
                });

                setSelectedActive(typeKey);
            }
        },
        [ dispatch, queryParams, selectedActive ],
    );

    const renderPrivilegedComponent = useCallback(
        () => {
            const { isAdmin } = user;

            return (
                isAdmin && (
                    <Heading
                      type={HeadingType.secondary}
                    >
                        Submissions awaiting execution:
                        {' '}
                        {15}
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
        [ user, selectedActive, handleSelectSubmissionState ],
    );

    return (
        <>
            <Heading type={HeadingType.primary}>
                Latest
                {' '}
                {submissions.items?.length}
                {' '}
                submissions out of
                {' '}
                {isNil(totalSubmissionsCount)
                    ? '...'
                    : totalSubmissionsCount }
                {' '}
                total
            </Heading>
            {renderPrivilegedComponent()}
            <SubmissionsGrid
              isDataLoaded={!areSubmissionsLoading}
              submissions={submissions}
              handlePageChange={handlePageChange}
              options={{
                  showDetailedResults: user.isAdmin,
                  showTaskDetails: true,
                  showCompeteMarker: user.isAdmin,
                  showSubmissionTypeInfo: user.isAdmin,
              }}
            />
        </>
    );
};

export default RecentSubmissions;
