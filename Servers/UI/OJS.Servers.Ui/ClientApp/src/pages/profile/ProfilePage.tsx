import React, { useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';

import Heading from '../../components/guidelines/headings/Heading';
import Tabs from '../../components/guidelines/tabs/Tabs';
import ProfileAboutInfo from '../../components/profile/profile-about-info/ProfileAboutInfo';
import ProfileContestParticipations
    from '../../components/profile/profile-contest-participations/ProfileContestParticipations';
import ProfileSubmissions from '../../components/profile/profile-submissions/ProfileSubmisssions';
import { useHashUrlParams } from '../../hooks/common/use-hash-url-params';
import { useUsers } from '../../hooks/use-users';
import { makePrivate } from '../shared/make-private';
import { setLayout } from '../shared/set-layout';

const ProfilePage = () => {
    const { profile, getProfile } = useUsers();
    const { state: { params }, actions: { clearHash } } = useHashUrlParams();

    useEffect(() => {
        if (!isEmpty(params)) {
            clearHash();
        }
    }, [ clearHash, params ]);

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
