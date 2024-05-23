import React, { useCallback, useEffect, useState } from 'react';
import isNil from 'lodash/isNil';

import { useLazyGetUserSubmissionsQuery } from '../../../redux/services/submissionsService';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import LegacyInfoMessage from '../../guidelines/legacy-info-message/LegacyInfoMessage';
import SubmissionsGrid from '../../submissions/submissions-grid/SubmissionsGrid';

import styles from './ProfileSubmissions.module.scss';

interface IProfileSubmissionsProps {
    userIsProfileOwner: boolean;
    isChosenInToggle: boolean;
}

const ProfileSubmissions = ({ userIsProfileOwner, isChosenInToggle }: IProfileSubmissionsProps) => {
    const [ shouldRender, setShouldRender ] = useState<boolean>(false);
    const [ userSubmissionsPage, setUserSubmissionsPage ] = useState<number>(1);

    const { internalUser, isLoggedIn } = useAppSelector((reduxState) => reduxState.authorization);
    const { profile } = useAppSelector((state) => state.users);

    const dispatch = useAppDispatch();

    const [ getUserSubmissionsQuery, {
        data: userSubmissions,
        isLoading: areSubmissionsLoading,
        error: userSubmissionsQueryError,
    } ] = useLazyGetUserSubmissionsQuery();

    useEffect(() => {
        const isProfileAvailable = !isNil(profile);
        const canAccess = isLoggedIn && isProfileAvailable;
        const hasAdminAccess = internalUser.canAccessAdministration;
        const isOwnerAccessNotAllowed = userIsProfileOwner && !isChosenInToggle && !hasAdminAccess;
        const isNonOwnerAccessNotAllowed = !userIsProfileOwner && (!hasAdminAccess || !isChosenInToggle);

        if (!canAccess || isOwnerAccessNotAllowed || isNonOwnerAccessNotAllowed) {
            return;
        }

        getUserSubmissionsQuery({
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            username: profile?.userName!,
            page: userSubmissionsPage,
        });
    }, [ getUserSubmissionsQuery, internalUser, isChosenInToggle, isLoggedIn, profile, userIsProfileOwner, userSubmissionsPage ]);

    useEffect(() => {
        if (!isChosenInToggle || areSubmissionsLoading || isNil(userSubmissions)) {
            setShouldRender(false);
            return;
        }

        setShouldRender(true);
    }, [ areSubmissionsLoading, dispatch, isChosenInToggle, userSubmissions ]);

    const render = useCallback(() => {
        if (!isNil(userSubmissionsQueryError)) {
            return (<span>Error fetching user submissions</span>);
        }

        if (!shouldRender) {
            return null;
        }

        return (
            <SubmissionsGrid
              isDataLoaded={!areSubmissionsLoading}
              submissions={userSubmissions!}
              handlePageChange={(page: number) => setUserSubmissionsPage(page)}
              className={styles.profileSubmissionsGrid}
              options={{
                  showTaskDetails: true,
                  showDetailedResults: internalUser.canAccessAdministration || userIsProfileOwner,
                  showCompeteMarker: false,
                  showSubmissionTypeInfo: false,
                  showParticipantUsername: false,
              }}
            />
        );
    }, [
        areSubmissionsLoading,
        internalUser.canAccessAdministration,
        shouldRender,
        userIsProfileOwner,
        userSubmissions,
        userSubmissionsQueryError,
    ]);

    return render();
};

export default ProfileSubmissions;
