import { Link } from 'react-router-dom';

import { IUSerSearchCardProps } from '../../../common/types';
import useTheme from '../../../hooks/use-theme';
import { encodeAsUrlParam, getUserProfileInfoUrlByUsername } from '../../../utils/urls';

import styles from './UserSearchCard.module.scss';

interface IUserSearchCardProps {
    user: IUSerSearchCardProps;
}

const UserSearchCard = (props: IUserSearchCardProps) => {
    const { user } = props;
    const { themeColors, getColorClassName } = useTheme();

    const textColorClassName = getColorClassName(themeColors.textColor);

    return (
        <Link
          to={getUserProfileInfoUrlByUsername(encodeAsUrlParam(user.name))}
          className={`${styles.userSearchCardWrapper} ${textColorClassName}`}
          style={{ borderColor: themeColors.textColor }}
        >
            { user.name }
        </Link>
    );
};

export default UserSearchCard;
