import * as React from 'react';
import { useEffect } from 'react';

import { setLayout } from '../shared/set-layout';
import { useUsers } from '../../hooks/use-users';
import Heading from '../../components/guidelines/headings/Heading';
import ProfileAboutInfo from '../../components/profile/profile-about-info/ProfileAboutInfo';
import ProfileSubmissions from '../../components/profile/profile-submissions/ProfileSubmisssions';
import ProfileContestParticipations
    from '../../components/profile/profile-contest-participations/ProfileContestParticipations';
import { makePrivate } from '../shared/make-private';
import Tabs from '../../components/guidelines/tabs/Tabs';

const ProfilePage = () => {
    const { profile, getProfile } = useUsers();

    useEffect(() => {
        (async () => {
            await getProfile();
        })();
    }, [ getProfile ]);

    return (
        <>
            <Heading>Profile</Heading>
            <ProfileAboutInfo value={profile} />
            <Tabs
              labels={[ 'Submissions', 'Contest Participations' ]}
              contents={[ <ProfileSubmissions />, <ProfileContestParticipations /> ]}
            />
        </>
    );
};

export default makePrivate(setLayout(ProfilePage));
