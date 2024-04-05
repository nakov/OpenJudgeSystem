import React, { useEffect, useState } from 'react';
import isNil from 'lodash/isNil';

import { setCurrentPage, setProfileSubmissions } from '../../../redux/features/submissionsSlice';
import { useGetUserSubmissionsQuery } from '../../../redux/services/submissionsService';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { flexCenterObjectStyles } from '../../../utils/object-utils';
import SpinningLoader from '../../guidelines/spinning-loader/SpinningLoader';
import SubmissionsGrid from '../../submissions/submissions-grid/SubmissionsGrid';

interface IProfileSubmissionsProps {
    userIsProfileOwner: boolean;
    isChosenInToggle: boolean;
}

const ProfileSubmissions = ({ userIsProfileOwner, isChosenInToggle }: IProfileSubmissionsProps) => {
    const [ shouldSkipFetchData, setShouldSkipFetchData ] = useState<boolean>(true);
    const [ shouldRender, setShouldRender ] = useState<boolean>(false);

    const { internalUser, isLoggedIn } = useAppSelector((reduxState) => reduxState.authorization);
    const { profile } = useAppSelector((state) => state.users);

    const dispatch = useAppDispatch();

    const {
        profileSubmissions,
        currentPage,
    } = useAppSelector((state) => state.submissions);

    const {
        data: userSubmissions,
        isLoading: areSubmissionsLoading,
    } = useGetUserSubmissionsQuery({
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        username: profile?.userName!,
        page: currentPage,
    }, { skip: shouldSkipFetchData });

    useEffect(() => {
        // Preliminary checks for common conditions
        const isProfileAvailable = !isNil(profile);
        const canAccess = isLoggedIn && isProfileAvailable;
        const hasAdminAccess = internalUser.canAccessAdministration;
        const isOwnerAccessNotAllowed = userIsProfileOwner && !isChosenInToggle && !hasAdminAccess;
        const isNonOwnerAccessNotAllowed = !userIsProfileOwner && (!hasAdminAccess || !isChosenInToggle);

        // Combined condition to set 'setShouldSkipFetchData'
        if (!canAccess || isOwnerAccessNotAllowed || isNonOwnerAccessNotAllowed) {
            setShouldSkipFetchData(true);
            return;
        }

        setShouldSkipFetchData(false);
    }, [ internalUser, isChosenInToggle, isLoggedIn, profile, userIsProfileOwner ]);

    useEffect(() => {
        if (!isChosenInToggle || areSubmissionsLoading || isNil(userSubmissions)) {
            setShouldRender(false);
            return;
        }

        setShouldRender(true);
    }, [ areSubmissionsLoading, dispatch, isChosenInToggle, shouldSkipFetchData, userSubmissions ]);

    useEffect(() => {
        if (!isNil(userSubmissions)) {
            dispatch(setProfileSubmissions(userSubmissions));
        }
    }, [ dispatch, userSubmissions ]);

    return (
        areSubmissionsLoading
            ? (
                <div style={{ ...flexCenterObjectStyles, marginTop: '10px' }}>
                    <SpinningLoader />
                </div>
            )
            : shouldRender
                ? (
                    <SubmissionsGrid
                      isDataLoaded={!areSubmissionsLoading}
                      submissions={profileSubmissions}
                      handlePageChange={(page: number) => dispatch(setCurrentPage(page))}
                      options={{
                          showTaskDetails: true,
                          showDetailedResults: internalUser.canAccessAdministration || userIsProfileOwner,
                          showCompeteMarker: false,
                          showSubmissionTypeInfo: false,
                          showParticipantUsername: false,
                      }}
                    />
                )
                : null

    );
};

export default ProfileSubmissions;
