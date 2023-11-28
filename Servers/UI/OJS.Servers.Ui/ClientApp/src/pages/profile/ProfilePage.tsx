import React, { useCallback, useEffect } from 'react';

import Heading from '../../components/guidelines/headings/Heading';
import SpinningLoader from '../../components/guidelines/spinning-loader/SpinningLoader';
import ProfileAboutInfo from '../../components/profile/profile-about-info/ProfileAboutInfo';
import { useUsers } from '../../hooks/use-users';
import isNilOrEmpty from '../../utils/check-utils';
import { flexCenterObjectStyles } from '../../utils/object-utils';
import { makePrivate } from '../shared/make-private';
import { setLayout } from '../shared/set-layout';
// import Tabs from '../../components/guidelines/tabs/Tabs';
// import ProfileContestParticipations
//     from '../../components/profile/profile-contest-participations/ProfileContestParticipations';
// import ProfileSubmissions from '../../components/profile/profile-submissions/ProfileSubmisssions'

const ProfilePage = () => {
    const { profile, getProfile, isLoading } = useUsers();

    useEffect(() => {
        (async () => {
            await getProfile();
        })();
    }, [ getProfile ]);

    const renderUsernameHeading = useCallback(
        () => {
            const { userName } = profile;

            return isNilOrEmpty(userName)
                ? (
                    <Heading>Profile</Heading>
                )
                : (
                    <Heading>
                        {profile.userName}
                        &apos;s
                        profile
                    </Heading>
                );
        },
        [ profile ],
    );

    if (isLoading) {
        return (
            <div style={{ ...flexCenterObjectStyles }}>
                <SpinningLoader />
            </div>
        );
    }

    return (
        <>
            {renderUsernameHeading()}
            <ProfileAboutInfo value={profile} />
            Tabs will be hidden for alpha version, as it is not production ready yet
            {/* <Tabs */}
            {/*  labels={[ 'Submissions', 'Contest Participations' ]} */}
            {/*  contents={[ <ProfileSubmissions />, <ProfileContestParticipations /> ]} */}
            {/* /> */}
        </>
    );
};

export default makePrivate(setLayout(ProfilePage));
