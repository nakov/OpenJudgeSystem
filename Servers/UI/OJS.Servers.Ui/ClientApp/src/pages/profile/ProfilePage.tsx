import React, { useEffect } from 'react';

import Heading from '../../components/guidelines/headings/Heading';
import Tabs from '../../components/guidelines/tabs/Tabs';
import ProfileAboutInfo from '../../components/profile/profile-about-info/ProfileAboutInfo';
import ProfileContestParticipations
    from '../../components/profile/profile-contest-participations/ProfileContestParticipations';
import ProfileSubmissions from '../../components/profile/profile-submissions/ProfileSubmisssions';
import { useUsers } from '../../hooks/use-users';
import { makePrivate } from '../shared/make-private';
import { setLayout } from '../shared/set-layout';
// import Tabs from '../../components/guidelines/tabs/Tabs';
// import ProfileContestParticipations
//     from '../../components/profile/profile-contest-participations/ProfileContestParticipations';
// import ProfileSubmissions from '../../components/profile/profile-submissions/ProfileSubmisssions'
import SpinningLoader from "../../components/guidelines/spinning-loader/SpinningLoader";
import {flexCenterObjectStyles} from "../../utils/object-utils"

const ProfilePage = () => {
    const { profile, getProfile, isLoading } = useUsers();

    useEffect(() => {
        (async () => {
            await getProfile();
        })();
    }, [ getProfile ]);
    
    if(isLoading) {
        return (<div style={{...flexCenterObjectStyles}}>
            <SpinningLoader/>
        </div>)
    }
    
    return (
        <>
            <Heading>Profile</Heading>
            <ProfileAboutInfo value={profile} />
            {/* Tabs will be hidden for alpha version, as it is not production ready yet */}
            {/* <Tabs */}
            {/*    labels={['Submissions', 'Contest Participations']} */}
            {/*    contents={[<ProfileSubmissions/>, <ProfileContestParticipations/>]} */}
            {/* /> */}
        </>
    );
};

export default makePrivate(setLayout(ProfilePage));
