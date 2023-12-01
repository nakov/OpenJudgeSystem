import React, { useCallback } from 'react';

import { IUserSearchType } from '../../../common/search-types';
import { useUsers } from '../../../hooks/use-users';
import concatClassNames from '../../../utils/class-names';
import { getUserProfileInfoUrlByUsername } from '../../../utils/urls';
import { Button, ButtonSize, ButtonType } from '../../guidelines/buttons/Button';

import styles from './SearchUser.module.scss';

interface ISearchUser {
    user: IUserSearchType;
}

const SearchUser = ({ user }: ISearchUser) => {
    const { actions: { initiateRedirectionToUserProfile } } = useUsers();

    const searchProblemCardHeader = 'search-header';
    const searchUserCardHeaderClassName = concatClassNames(
        styles.userCardHeader,
        searchProblemCardHeader,
        user.name.length >= 23
            ? styles.usernameHoverable
            : '',
    );
    const searchUserText = 'search-user-text';
    const searchUserClassName = concatClassNames(styles.userText, searchUserText);
    const searchUserElement = 'search-user-element';
    const searchUserElementClassName = concatClassNames(styles.userElement, searchUserElement);

    const handleUserRedirection = useCallback(
        () => {
            const getUserProfileInfoUrl = getUserProfileInfoUrlByUsername(user.name);

            initiateRedirectionToUserProfile(user.name, getUserProfileInfoUrl);
        },
        [ initiateRedirectionToUserProfile, user.name ],
    );

    return (
        <div className={searchUserCardHeaderClassName}>
            <div className={searchUserElementClassName}>
                <div className={styles.tooltip}>
                    <span className={styles.tooltipText}>
                        <Button
                          internalClassName={styles.redirectButton}
                          type={ButtonType.secondary}
                          text={user.name}
                          onClick={handleUserRedirection}
                          size={ButtonSize.small}
                        />
                    </span>
                </div>
                <span className={searchUserClassName}>
                    <Button
                      internalClassName={styles.redirectButton}
                      type={ButtonType.secondary}
                      text={user.name}
                      onClick={handleUserRedirection}
                      size={ButtonSize.small}
                    />
                </span>
            </div>
        </div>
    );
};

export default SearchUser;
