import { IUserSearchType } from '../../../common/search-types';
import concatClassNames from '../../../utils/class-names';
import { encodeAsUrlParam, getUserProfileInfoUrlByUsername } from '../../../utils/urls';
import { ButtonSize, LinkButton, LinkButtonType } from '../../guidelines/buttons/Button';

import styles from './SearchUser.module.scss';

interface ISearchUser {
    user: IUserSearchType;
}

const SearchUser = ({ user }: ISearchUser) => {
    const searchUserText = 'search-user-text';
    const searchUserClassName = concatClassNames(styles.userText, searchUserText);
    const searchUserElement = 'search-user-element';
    const searchUserElementClassName = concatClassNames(styles.userElement, searchUserElement);

    return (
        <div className={searchUserElementClassName}>
            <span className={searchUserClassName}>
                <LinkButton
                  type={LinkButtonType.plain}
                  size={ButtonSize.none}
                  to={getUserProfileInfoUrlByUsername(encodeAsUrlParam(user.name))}
                  text={user.name}
                />
            </span>
        </div>
    );
};

export default SearchUser;
