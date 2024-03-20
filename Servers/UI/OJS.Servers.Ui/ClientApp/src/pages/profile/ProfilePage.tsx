import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import isNil from 'lodash/isNil';

import PageBreadcrumbs, { IPageBreadcrumbsItem } from '../../components/guidelines/breadcrumb/PageBreadcrumbs';
import SpinningLoader from '../../components/guidelines/spinning-loader/SpinningLoader';
import ProfileAboutInfo from '../../components/profile/profile-about-info/ProfileAboutInfo';
import ProfileSubmissions from '../../components/profile/profile-submissions/ProfileSubmisssions';
import { usePageTitles } from '../../hooks/use-page-titles';
import { setProfile } from '../../redux/features/usersSlice';
import { useGetProfileQuery } from '../../redux/services/usersService';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { decodeFromUrlParam } from '../../utils/urls';
import { makePrivate } from '../shared/make-private';
import { setLayout } from '../shared/set-layout';

const ProfilePage = () => {
    const { internalUser, isLoggedIn } = useAppSelector((reduxState) => reduxState.authorization);
    const { profile } = useAppSelector((reduxState) => reduxState.users);

    const [
        currentUserIsProfileOwner,
        setCurrentUserIsProfileOwner,
    ] = useState<boolean>(false);

    const { actions: { setPageTitle } } = usePageTitles();
    const { usernameFromUrl } = useParams();
    const dispatch = useAppDispatch();

    const {
        data: profileInfo,
        isLoading: isProfileInfoLoading,
    } = useGetProfileQuery({
        username: !isNil(usernameFromUrl)
            ? decodeFromUrlParam(usernameFromUrl)
            : internalUser.userName,
    });

    useEffect(
        () => {
            if (isNil(profileInfo)) {
                return;
            }

            dispatch(setProfile(profileInfo));
            setPageTitle(`${profileInfo.userName}'s profile`);
        },
        [ dispatch, profileInfo, setPageTitle ],
    );

    useEffect(() => {
        if (!isLoggedIn || isNil(profile)) {
            return;
        }

        setCurrentUserIsProfileOwner(profile.userName === internalUser.userName);
    }, [ internalUser, profile, isLoggedIn ]);

    return (
        isProfileInfoLoading || isNil(profile)
            ? <SpinningLoader />
            : (
                <>
                    <PageBreadcrumbs
                      keyPrefix="profile"
                      items={[
                            {
                                text: 'My Profile',
                                to: '/profile',
                            } as IPageBreadcrumbsItem,
                      ]}
                    />
                    <ProfileAboutInfo
                      userProfile={profile}
                      isUserAdmin={internalUser.isAdmin}
                      isUserProfileOwner={currentUserIsProfileOwner}
                    />
                    {(internalUser.canAccessAdministration || currentUserIsProfileOwner) && <ProfileSubmissions />}
                    {/* <ProfileContestParticipations /> */}
                    {/* Tabs will be hidden for alpha version,
                         as it is not production ready yet */}
                    {/* <Tabs */}
                    {/*  labels={[ 'Submissions', 'Contest Participations' ]} */}
                    {/*  contents={[ <ProfileSubmissions />, */}
                    {/*  <ProfileContestParticipations /> ]} */}
                    {/* /> */}
                </>
            )
    );
};

export default makePrivate(setLayout(ProfilePage));
