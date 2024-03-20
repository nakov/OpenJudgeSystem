import React from 'react';

import MyProfileSvg from '../../../assets/my-profile.svg';
import { IUserProfileType } from '../../../common/types';
import useTheme from '../../../hooks/use-theme';
import isNilOrEmpty from '../../../utils/check-utils';
import concatClassNames from '../../../utils/class-names';

import styles from './ProfileAboutInfo.module.scss';

interface IProfileAboutInfoProps {
    userProfile: IUserProfileType;
    isUserAdmin : boolean;
    isUserProfileOwner : boolean;
}

const ProfileAboutInfo = ({ userProfile, isUserAdmin, isUserProfileOwner } : IProfileAboutInfoProps) => {
    const { themeColors, getColorClassName } = useTheme();

    const shouldRenderName = !isNilOrEmpty(userProfile.firstName) || !isNilOrEmpty(userProfile.lastName);

    const aboutInfoClassName = concatClassNames(
        styles.profileAboutInfo,
        getColorClassName(themeColors.textColor),
    );

    return (
        <div className={styles.profileAbout}>
            <div className={aboutInfoClassName}>
                <div className={styles.profileAboutInfoGroupControl}>
                    <span className={styles.profileAboutInfoLabel}>Username:</span>
                    <span className={styles.profileAboutInfoValue}>{userProfile.userName}</span>
                </div>
                {
                    (isUserAdmin || isUserProfileOwner) && shouldRenderName && (
                        <div className={styles.profileAboutInfoGroupControl}>
                            <span className={styles.profileAboutInfoLabel}>Name:</span>
                            <span className={styles.profileAboutInfoValue}>
                                {userProfile.firstName}
                                {' '}
                                {userProfile.lastName}
                            </span>
                        </div>
                    )
                }
                {
                    (isUserAdmin || isUserProfileOwner) && (
                        <div className={styles.profileAboutInfoGroupControl}>
                            <span className={styles.profileAboutInfoLabel}>Email:</span>
                            <span className={styles.profileAboutInfoValue}>{userProfile.email}</span>
                        </div>
                    )
                }
                {
                    isUserAdmin && (
                        <div className={styles.profileAboutInfoGroupControl}>
                            <span className={styles.profileAboutInfoLabel}>Id:</span>
                            <span className={styles.profileAboutInfoValue}>{userProfile.id}</span>
                        </div>
                    )
                }
                {
                    !isNilOrEmpty(userProfile.age) && (
                        <div className={styles.profileAboutInfoGroupControl}>
                            <span className={styles.profileAboutInfoLabel}>Age:</span>
                            <span className={styles.profileAboutInfoValue}>{userProfile.age}</span>
                        </div>
                    )
                }
                {
                    !isNilOrEmpty(userProfile.city) &&
                        (
                            <div className={styles.profileAboutInfoGroupControl}>
                                <span className={styles.profileAboutInfoLabel}>City:</span>
                                <span className={styles.profileAboutInfoValue}>{userProfile.city}</span>
                            </div>
                        )
                }
            </div>
            <div>
                <img height={180} width={180} src={MyProfileSvg} alt="my-profile" />
            </div>
        </div>
    );
};

export default ProfileAboutInfo;
