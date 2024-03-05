import { IUserProfileType } from '../../../hooks/use-users';
import isNilOrEmpty from '../../../utils/check-utils';

import styles from './ProfileAboutInfo.module.scss';

interface IProfileAboutInfoProps {
    userProfile: IUserProfileType;
    isUserAdmin : boolean;
    isUserProfileOwner : boolean;
}

const ProfileAboutInfo = ({ userProfile, isUserAdmin, isUserProfileOwner } : IProfileAboutInfoProps) => {
    const shouldRenderName = !isNilOrEmpty(userProfile.firstName) || !isNilOrEmpty(userProfile.lastName);

    return (
        <div className={styles.profileAboutInfo}>
            <div className={styles.profileAboutInfoGroupControl}>
                <h2>Username:</h2>
                <p>{userProfile.userName}</p>
            </div>
            {(isUserAdmin || isUserProfileOwner) && (
            <div className={styles.profileAboutInfoGroupControl}>
                {shouldRenderName && (
                <div className={styles.profileAboutInfoGroupControl}>
                    <h2>Name:</h2>
                    <p>
                        {userProfile.firstName}
                        {' '}
                        {userProfile.lastName}
                    </p>
                </div>
                )}
                <div className={styles.profileAboutInfoGroupControl}>
                    <h2>Email:</h2>
                    <p>{userProfile.email}</p>
                </div>
                {isUserAdmin && (
                <div className={styles.profileAboutInfoGroupControl}>
                    <h2>Id:</h2>
                    <p>{userProfile.id}</p>
                </div>
                )}
                {!isNilOrEmpty(userProfile.age) &&
                            (
                            <div className={styles.profileAboutInfoGroupControl}>
                                <h2>Age:</h2>
                                <p>{userProfile.age}</p>
                            </div>
                            )}
                {!isNilOrEmpty(userProfile.city) &&
                            (
                                <div className={styles.profileAboutInfoGroupControl}>
                                    <h2>City:</h2>
                                    <p>{userProfile.city}</p>
                                </div>
                            )}
            </div>
            )}
        </div>
    );
};

export default ProfileAboutInfo;
