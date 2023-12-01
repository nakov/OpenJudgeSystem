import React, { useCallback, useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import Heading from '../../components/guidelines/headings/Heading';
import SpinningLoader from '../../components/guidelines/spinning-loader/SpinningLoader';
import ProfileAboutInfo from '../../components/profile/profile-about-info/ProfileAboutInfo';
import ProfileContestParticipations
    from '../../components/profile/profile-contest-participations/ProfileContestParticipations';
import { useAuth } from '../../hooks/use-auth';
import { usePageTitles } from '../../hooks/use-page-titles';
import { useUsers } from '../../hooks/use-users';
import isNilOrEmpty from '../../utils/check-utils';
import { flexCenterObjectStyles } from '../../utils/object-utils';
import NotFoundPage from '../not-found/NotFoundPage';
import { makePrivate } from '../shared/make-private';
import { setLayout } from '../shared/set-layout';
// import Tabs from '../../components/guidelines/tabs/Tabs';
// import ProfileContestParticipations
//     from '../../components/profile/profile-contest-participations/ProfileContestParticipations';
// import ProfileSubmissions from '../../components/profile/profile-submissions/ProfileSubmisssions'

const ProfilePage = () => {
    const {
        state: {
            myProfile,
            isProfileInfoLoading,
            isProfileInfoLoaded,
            userProfileUsername,
        },
        actions: {
            getProfile,
            clearUserProfileInformation,
        },
    } = useUsers();
    const { state: { user: { username: myUsername } } } = useAuth();
    const { actions: { setPageTitle } } = usePageTitles();

    useEffect(
        () => {
            if (isNil(userProfileUsername)) {
                return;
            }
            setPageTitle(`${userProfileUsername}'s profile`);
        },
        [ setPageTitle, userProfileUsername ],
    );

    useEffect(
        () => {
            if (!isEmpty(myProfile.userName)) {
                return;
            }

            const usernameParam = isNil(userProfileUsername)
                ? myUsername
                : userProfileUsername;

            getProfile(usernameParam);
        },
        [ getProfile, myProfile.userName, myUsername, userProfileUsername ],
    );

    useEffect(
        () => () => {
            clearUserProfileInformation();
        },
        [ clearUserProfileInformation ],
    );

    const renderUsernameHeading = useCallback(
        () => {
            const username = isNil(userProfileUsername)
                ? myUsername
                : userProfileUsername;

            return isNilOrEmpty(username)
                ? (
                    <Heading>Profile</Heading>
                )
                : (
                    <Heading>
                        {username}
                        &apos;s
                        profile
                    </Heading>
                );
        },
        [ myUsername, userProfileUsername ],
    );

    const renderPage = useCallback(
        () => (
            isEmpty(myProfile.userName) && isProfileInfoLoaded
                ? <NotFoundPage />
                : (
                    <>
                        {renderUsernameHeading()}
                        <ProfileAboutInfo value={myProfile} />
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
        [ myProfile, renderUsernameHeading, isProfileInfoLoaded ],
    );

    if (isProfileInfoLoading) {
        return (
            <div style={{ ...flexCenterObjectStyles }}>
                <SpinningLoader />
            </div>
        );
    }

    return renderPage();
};

export default makePrivate(setLayout(ProfilePage));
