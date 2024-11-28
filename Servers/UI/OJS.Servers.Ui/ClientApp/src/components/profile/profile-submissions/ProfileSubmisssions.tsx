import React, { useCallback, useEffect, useState } from 'react';
import isNil from 'lodash/isNil';

import { useGetUserSubmissionsQuery } from '../../../redux/services/submissionsService';
import { useAppSelector } from '../../../redux/store';
import SubmissionsGrid from '../../submissions/submissions-grid/SubmissionsGrid';

import styles from './ProfileSubmissions.module.scss';

interface IProfileSubmissionsProps {
    userIsProfileOwner: boolean | null;
    isChosenInToggle: boolean;
}

const ProfileSubmissions = ({ userIsProfileOwner, isChosenInToggle }: IProfileSubmissionsProps) => {
    const [ shouldRender, setShouldRender ] = useState<boolean>(false);
    const [ userSubmissionsPage, setUserSubmissionsPage ] = useState<number>(1);

    const { internalUser, isLoggedIn } = useAppSelector((reduxState) => reduxState.authorization);
    const { profile } = useAppSelector((state) => state.users);

    const canFetchSubmissions = React.useMemo(() => {
        const isProfileAvailable = !isNil(profile);
        const canAccess = isLoggedIn && isProfileAvailable;
        const hasAdminAccess = internalUser.canAccessAdministration;
        const isOwnerAccessNotAllowed = userIsProfileOwner && !isChosenInToggle;
        const isNonOwnerAccessNotAllowed = !userIsProfileOwner && (!hasAdminAccess || !isChosenInToggle);

        return canAccess && !isOwnerAccessNotAllowed && !isNonOwnerAccessNotAllowed;
    }, [ profile, isLoggedIn, internalUser, isChosenInToggle, userIsProfileOwner ]);

    const {
        data: userSubmissions,
        isLoading: areSubmissionsLoading,
        error: userSubmissionsQueryError,
    } = useGetUserSubmissionsQuery(
        {
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            username: profile?.userName!,
            page: userSubmissionsPage,
        },
        { skip: !canFetchSubmissions },
    );

    useEffect(() => {
        if (!isChosenInToggle || areSubmissionsLoading || isNil(userSubmissions)) {
            setShouldRender(false);
            return;
        }

        setShouldRender(true);
    }, [ areSubmissionsLoading, isChosenInToggle, userSubmissions ]);

    const render = useCallback(() => {
        if (!isNil(userSubmissionsQueryError)) {
            return <span>Error fetching user submissions</span>;
        }

        if (!shouldRender || isNil(userIsProfileOwner)) {
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
