import React from 'react';

import { IUserProfileType } from '../../../hooks/use-users';
import isNilOrEmpty from '../../../utils/check-utils';

import styles from './ProfileAboutInfo.module.scss';

interface IProfileAboutInfoProps {
    value: IUserProfileType;
}

const ProfileAboutInfo = ({ value } : IProfileAboutInfoProps) => (
    <div className={styles.profileAboutInfo}>
        <div className={styles.profileAboutInfoGroupControl}>
            <h2>Username:</h2>
            <p>{value.userName}</p>
        </div>
        {
            isNilOrEmpty(value.firstName) || isNilOrEmpty(value.lastName)
                ? null
                : (
                    <div className={styles.profileAboutInfoGroupControl}>
                        <h2>Name:</h2>
                        <p>
                            {value.firstName}
                            {' '}
                            {value.lastName}
                        </p>
                    </div>
                )
        }
        <div className={styles.profileAboutInfoGroupControl}>
            <h2>Email:</h2>
            <p>{value.email}</p>
        </div>
    </div>
);

export default ProfileAboutInfo;
