import * as React from 'react';
import { IUserProfileType } from '../../../hooks/use-users';
import styles from './ProfileAboutInfo.module.scss';
import { LinkButton, LinkButtonType } from '../../guidelines/buttons/Button';

interface IProfileAboutInfoProps {
    value: IUserProfileType
}

const ProfileAboutInfo = ({ value } : IProfileAboutInfoProps) => (
    <div className={styles.profileAboutInfo}>
        <div className={styles.profileAboutInfoGroupControl}>
            <h2>Username:</h2>
            <p>{value.userName}</p>
        </div>
        <div className={styles.profileAboutInfoGroupControl}>
            <h2>Name:</h2>
            <p>
                {value.firstName}
                {' '}
                {value.lastName}
            </p>
        </div>
        <div className={styles.profileAboutInfoGroupControl}>
            <h2>Email:</h2>
            <p>{value.email}</p>
        </div>
        <LinkButton
          text="Update"
          to="/"
          type={LinkButtonType.secondary}
        />
    </div>
);

export default ProfileAboutInfo;
