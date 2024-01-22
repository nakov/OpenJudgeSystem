import { useSelector } from 'react-redux';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import Heading from '../../components/guidelines/headings/Heading';
import ProfileAboutInfo from '../../components/profile/profile-about-info/ProfileAboutInfo';
import ProfileContestParticipations
    from '../../components/profile/profile-contest-participations/ProfileContestParticipations';
import ProfileSubmissions from '../../components/profile/profile-submissions/ProfileSubmisssions';
import { useUserProfileSubmissions } from '../../hooks/submissions/use-profile-submissions';
import { usePageTitles } from '../../hooks/use-page-titles';
import { useUsers } from '../../hooks/use-users';
import { IAuthorizationReduxState } from '../../redux/features/authorizationSlice';
import isNilOrEmpty from '../../utils/check-utils';
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
        },
        actions: {
            getProfile,
            clearUserProfileInformation,
        },
    } = useUsers();
    const { userName: myUsername, permissions: { canAccessAdministration: canSeeProfileSubmissions } =
    useSelector((state: {authorization: IAuthorizationReduxState}) => state.authorization.internalUser);
    const { actions: { setUsernameForProfile } } = useUserProfileSubmissions();
    const { actions: { setPageTitle } } = usePageTitles();
    const { username } = useParams();
    const [ currentUserIsProfileOwner, setCurrentUserIsProfileOwner ] = useState<boolean>(false);

    useEffect(
        () => {
            if (!isEmpty(myProfile.userName)) {
                return;
            }

            const usernameParam = !isNil(username)
                ? username
                : myUsername;

            setUsernameForProfile(usernameParam);
            setCurrentUserIsProfileOwner(decodeUsernameFromUrlParam(usernameParam) === myUsername);
            getProfile(decodeUsernameFromUrlParam(usernameParam));
        },
        [ getProfile, myProfile, myProfile.userName, myUsername, setUsernameForProfile, username ],
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
                        <ProfileAboutInfo
                          userProfile={myProfile}
                          isUserAdmin={canSeeProfileSubmissions}
                          isUserProfileOwner={currentUserIsProfileOwner}
                        />
                        {(canSeeProfileSubmissions || currentUserIsProfileOwner) && <ProfileSubmissions />}
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
        [ myProfile, isProfileInfoLoaded, renderUsernameHeading, canSeeProfileSubmissions, currentUserIsProfileOwner ],
    );

    return renderPage();
};

export default makePrivate(setLayout(ProfilePage));
