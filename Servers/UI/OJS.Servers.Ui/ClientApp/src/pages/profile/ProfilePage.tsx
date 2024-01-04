import React, { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import Heading from '../../components/guidelines/headings/Heading';
import ProfileAboutInfo from '../../components/profile/profile-about-info/ProfileAboutInfo';
import ProfileContestParticipations
    from '../../components/profile/profile-contest-participations/ProfileContestParticipations';
import { useAuth } from '../../hooks/use-auth';
import { usePageTitles } from '../../hooks/use-page-titles';
import { useUsers } from '../../hooks/use-users';
import isNilOrEmpty from '../../utils/check-utils';
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
            isProfileInfoLoaded,
        },
        actions: {
            getProfile,
            clearUserProfileInformation,
        },
    } = useUsers();
    const { state: { user: { username: myUsername } } } = useAuth();
    const { actions: { setPageTitle } } = usePageTitles();
    const { username } = useParams();

    useEffect(
        () => {
            if (!isEmpty(myProfile.userName)) {
                return;
            }

            const usernameParam = !isNil(username)
                ? username
                : myUsername;

            const decodedUsernameParam = usernameParam.replace(/~/g, '.');

            getProfile(decodedUsernameParam);
        },
        [ getProfile, myProfile, myProfile.userName, myUsername, username ],
    );

    useEffect(
        () => {
            if (!isProfileInfoLoaded) {
                return;
            }

            setPageTitle(`${myProfile.userName}'s profile`);
        },
        [ setPageTitle, myProfile, isProfileInfoLoaded ],
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

    return renderPage();
};

export default makePrivate(setLayout(ProfilePage));
