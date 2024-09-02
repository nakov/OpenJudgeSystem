import { ReactNode } from 'react';

import { NEW_ADMINISTRATION_PATH } from '../../../common/urls/administration-urls';
import { useAppSelector } from '../../../redux/store';

import { ButtonSize, LinkButton, LinkButtonType } from './Button';

interface IAdministrationLinkProps {
    text?: string;
    to: string;
    type?: LinkButtonType;
    className?: string;
    children?: ReactNode;
    userHasAccess?: boolean;
}

const AdministrationLink = ({ text, to, type, className, children, userHasAccess = true }: IAdministrationLinkProps) => {
    const { internalUser: user } = useAppSelector((state) => state.authorization);

    if (!user.canAccessAdministration || !userHasAccess) {
        return null;
    }

    return (
        <LinkButton
          text={text}
          size={ButtonSize.small}
          type={type ?? LinkButtonType.secondary}
          to={`/${NEW_ADMINISTRATION_PATH}${to.startsWith('/')
              ? ''
              : '/'}${to}`}
          isToExternal
          className={className}
        >
            {children}
        </LinkButton>
    );
};

export default AdministrationLink;
