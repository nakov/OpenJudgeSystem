import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import Heading from '../../components/guidelines/headings/Heading';
import SpinningLoader from '../../components/guidelines/spinning-loader/SpinningLoader';
import ProfileAboutInfo from '../../components/profile/profile-about-info/ProfileAboutInfo';
import ProfileContestParticipations
    from '../../components/profile/profile-contest-participations/ProfileContestParticipations';
import ProfileSubmissions from '../../components/profile/profile-submissions/ProfileSubmisssions';
import { useUserProfileSubmissions } from '../../hooks/submissions/use-profile-submissions';
import { usePageTitles } from '../../hooks/use-page-titles';
import { useUsers } from '../../hooks/use-users';
import { IAuthorizationReduxState } from '../../redux/features/authorizationSlice';
import isNilOrEmpty from '../../utils/check-utils';
import { flexCenterObjectStyles } from '../../utils/object-utils';
import { decodeUsernameFromUrlParam } from '../../utils/urls';
import NotFoundPage from '../not-found/NotFoundPage';
import { makePrivate } from '../shared/make-private';
import { setLayout } from '../shared/set-layout';

// import Tabs from '../../components/guidelines/tabs/Tabs';

const ProfilePage = () => {
    const {
        state: {
            myProfile,
            isProfileInfoLoaded,
            isProfileInfoLoading,
            isGetProfileQueryInitiated,
        },
        actions: {
            getProfile,
            clearUserProfileInformation,
        },
    } = useUsers();
    const { internalUser } =
        useSelector((reduxState: {authorization: IAuthorizationReduxState}) => reduxState.authorization);
    const { state: { usernameForProfile }, actions: { setUsernameForProfile } } = useUserProfileSubmissions();
    const { actions: { setPageTitle } } = usePageTitles();
    const { username } = useParams();
    const [ currentUserIsProfileOwner, setCurrentUserIsProfileOwner ] = useState<boolean>(false);

    useEffect(
        () => {
            if (!isEmpty(myProfile.userName) || isGetProfileQueryInitiated || isProfileInfoLoading) {
                return;
            }

            const usernameParam = !isNil(username)
                ? username
                : internalUser.userName;

            setUsernameForProfile(usernameParam);
            getProfile(decodeUsernameFromUrlParam(usernameParam));
        },
        [ getProfile, myProfile.userName, internalUser.userName, setUsernameForProfile, username ],
    );

    useEffect(
        () => {
            if (!isProfileInfoLoaded || isEmpty(myProfile.userName)) {
                return;
            }

            setPageTitle(`${usernameForProfile}'s profile`);
        },
        [ setPageTitle, myProfile, isProfileInfoLoaded, usernameForProfile ],
    );

    useEffect(
        () => {
            if (isEmpty(myProfile.userName)) {
                return;
            }

            setCurrentUserIsProfileOwner(decodeUsernameFromUrlParam(usernameForProfile) === internalUser.userName);
        },
        [ setPageTitle, myProfile, isProfileInfoLoaded, usernameForProfile ],
    );

    useEffect(
        () => () => {
            clearUserProfileInformation();
        },
        [ clearUserProfileInformation ],
    );

    const renderUsernameHeading = useCallback(
        () => {
            const usernameForHeading = isEmpty(myProfile.userName)
                ? username
                : myProfile.userName;

            return isNilOrEmpty(username)
                ? (
                    <Heading>Profile</Heading>
                )
                : (
                    <Heading>
                        {usernameForHeading}
                        &apos;s
                        profile
                    </Heading>
                );
        },
        [ myProfile.userName, username ],
    );

    const renderPage = useCallback(
        () =>
            ( isEmpty(myProfile.userName)
                    ? <NotFoundPage />
                    : (
                        <>
                            {renderUsernameHeading()}
                            <ProfileAboutInfo
                              userProfile={myProfile}
                              isUserAdmin={internalUser.isAdmin}
                              isUserProfileOwner={currentUserIsProfileOwner}
                            />
                            {(internalUser.canAccessAdministration || currentUserIsProfileOwner) && <ProfileSubmissions />}
                            <ProfileContestParticipations />
                            {/* Tabs will be hidden for alpha version,
                         as it is not production ready yet */}
                            {/* <Tabs */}
                            {/*  labels={[ 'Submissions', 'Contest Participations' ]} */}
                            {/*  contents={[ <ProfileSubmissions />, */}
                            {/*  <ProfileContestParticipations /> ]} */}
                            {/* /> */}
                        </>
                )
            ),
        [ isProfileInfoLoaded, isProfileInfoLoading, myProfile, renderUsernameHeading,
            internalUser.canAccessAdministration, currentUserIsProfileOwner ],
    );

    return isProfileInfoLoaded && !isProfileInfoLoading
        ? renderPage()
        : (
            <div style={{ ...flexCenterObjectStyles }}>
                <SpinningLoader />
            </div>
        );
};

export default makePrivate(setLayout(ProfilePage));
