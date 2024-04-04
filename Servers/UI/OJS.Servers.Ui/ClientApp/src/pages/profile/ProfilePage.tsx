import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import isNil from 'lodash/isNil';

import PageBreadcrumbs, { IPageBreadcrumbsItem } from '../../components/guidelines/breadcrumb/PageBreadcrumbs';
import Button, { ButtonType } from '../../components/guidelines/buttons/Button';
import SpinningLoader from '../../components/guidelines/spinning-loader/SpinningLoader';
import ProfileAboutInfo from '../../components/profile/profile-about-info/ProfileAboutInfo';
import ProfileContestParticipations
    from '../../components/profile/profile-contest-participations/ProfileContestParticipations';
import ProfileSubmissions from '../../components/profile/profile-submissions/ProfileSubmisssions';
import { usePageTitles } from '../../hooks/use-page-titles';
import useTheme from '../../hooks/use-theme';
import { setProfile } from '../../redux/features/usersSlice';
import { useGetProfileQuery } from '../../redux/services/usersService';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { decodeFromUrlParam } from '../../utils/urls';
import { setLayout } from '../shared/set-layout';

import styles from './ProfilePage.module.scss';

const ProfilePage = () => {
    const { internalUser, isLoggedIn } = useAppSelector((reduxState) => reduxState.authorization);
    const { profile } = useAppSelector((reduxState) => reduxState.users);
    const [ toggleValue, setToggleValue ] = useState<number>(1);
    const [ currentUserIsProfileOwner, setCurrentUserIsProfileOwner ] = useState<boolean>(false);

    const { actions: { setPageTitle } } = usePageTitles();
    const { username } = useParams();
    const { themeColors, getColorClassName } = useTheme();
    const dispatch = useAppDispatch();

    // If {username} is present in url, then the the profile should be loaded for this username,
    // otherwise the profile is loaded for the logged in user
    const profileUsername = useMemo(
        () => !isNil(username)
            ? decodeFromUrlParam(username)
            : internalUser.userName,
        [ internalUser, username ],
    );

    const {
        data: profileInfo,
        isLoading: isProfileInfoLoading,
    } = useGetProfileQuery(
        { username: profileUsername },
        { skip: isNil(internalUser) },
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

    return (
        isProfileInfoLoading
            ? <SpinningLoader />
            : isNil(profile)
                ? <span>No profile</span>
                : (
                    <div className={getColorClassName(themeColors.textColor)}>
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
                          isUserLecturer={internalUser.isInRole}
                          isUserProfileOwner={currentUserIsProfileOwner}
                        />
                        {
                            (currentUserIsProfileOwner || internalUser.canAccessAdministration) && (
                            <div className={styles.submissionsAndParticipationsToggle}>
                                <Button
                                  type={toggleValue === 1
                                      ? ButtonType.primary
                                      : ButtonType.secondary}
                                  className={styles.toggleBtn}
                                  text={currentUserIsProfileOwner
                                      ? 'My Submissions'
                                      : 'User Submissions'}
                                  onClick={() => setToggleValue(1)}
                                />
                                <Button
                                  type={toggleValue === 2
                                      ? ButtonType.primary
                                      : ButtonType.secondary}
                                  className={styles.toggleBtn}
                                  text={currentUserIsProfileOwner
                                      ? 'My Contests'
                                      : 'User Contests'}
                                  onClick={() => setToggleValue(2)}
                                />
                            </div>
                            )
                        }
                        {toggleValue === 1 &&
                            (currentUserIsProfileOwner || internalUser.canAccessAdministration) &&
                            <ProfileSubmissions userIsProfileOwner={currentUserIsProfileOwner} />}
                        {(toggleValue === 2 || (!currentUserIsProfileOwner && !internalUser.canAccessAdministration)) &&
                            <ProfileContestParticipations userIsProfileOwner={currentUserIsProfileOwner} />}
                    </div>
                )
    );
};

export default setLayout(ProfilePage);
