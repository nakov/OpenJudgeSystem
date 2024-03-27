import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import isNil from 'lodash/isNil';

import { SortType } from '../../common/contest-types';
import { IGetContestParticipationsForUserQueryParams, IIndexContestsType } from '../../common/types';
import ContestCard from '../../components/contests/contest-card/ContestCard';
import PageBreadcrumbs, { IPageBreadcrumbsItem } from '../../components/guidelines/breadcrumb/PageBreadcrumbs';
import List, { Orientation } from '../../components/guidelines/lists/List';
import SpinningLoader from '../../components/guidelines/spinning-loader/SpinningLoader';
import ProfileAboutInfo from '../../components/profile/profile-about-info/ProfileAboutInfo';
import ProfileSubmissions from '../../components/profile/profile-submissions/ProfileSubmisssions';
import { usePageTitles } from '../../hooks/use-page-titles';
import { setUserContestParticipations } from '../../redux/features/contestsSlice';
import { setProfile } from '../../redux/features/usersSlice';
import { useGetContestsParticipationsForUserQuery } from '../../redux/services/contestsService';
import { useGetProfileQuery } from '../../redux/services/usersService';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import isNilOrEmpty from '../../utils/check-utils';
import { decodeFromUrlParam } from '../../utils/urls';
import { makePrivate } from '../shared/make-private';
import { setLayout } from '../shared/set-layout';

const ProfilePage = () => {
    const [ currentUserIsProfileOwner, setCurrentUserIsProfileOwner ] = useState<boolean>(false);
    const { internalUser, isLoggedIn } = useAppSelector((reduxState) => reduxState.authorization);
    const { profile } = useAppSelector((reduxState) => reduxState.users);
    const { userContestParticipations } = useAppSelector((reduxState) => reduxState.contests);

    const { actions: { setPageTitle } } = usePageTitles();
    const { usernameFromUrl } = useParams();
    const dispatch = useAppDispatch();

    // If {username} is present in url, then the the profile should be loaded for this username,
    // otherwise the profile is loaded for the logged in user
    const profileUsername = useMemo(
        () => !isNil(usernameFromUrl)
            ? decodeFromUrlParam(usernameFromUrl)
            : internalUser.userName,
        [ internalUser, usernameFromUrl ],
    );

    const {
        data: profileInfo,
        isLoading: isProfileInfoLoading,
    } = useGetProfileQuery({ username: profileUsername });

    const {
        data: contestsParticipations,
        isLoading: areContestParticipationsLoading,
    } = useGetContestsParticipationsForUserQuery(
        {
            username: profileUsername,
            sortType: SortType.OrderBy,
        } as IGetContestParticipationsForUserQueryParams,
        { skip: isProfileInfoLoading },
    );

    useEffect(
        () => {
            if (areContestParticipationsLoading || isNil(contestsParticipations)) {
                return;
            }

            dispatch(setUserContestParticipations(contestsParticipations));
        },
        [ areContestParticipationsLoading, contestsParticipations, dispatch, profileInfo, setPageTitle ],
    );

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

    const renderContestCard = (contest: IIndexContestsType) => (<ContestCard contest={contest} />);

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
                    {
                        areContestParticipationsLoading
                            ? (<SpinningLoader />)
                            : !isNilOrEmpty(userContestParticipations.items)
                                ? (
                                    <List
                                      values={userContestParticipations.items!}
                                      itemFunc={renderContestCard}
                                      orientation={Orientation.vertical}
                                      fullWidth
                                    />
                                )
                                : 'User has not participated in contests'
                    }
                </>
            )
    );
};

export default makePrivate(setLayout(ProfilePage));
