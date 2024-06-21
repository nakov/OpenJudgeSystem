import { NEW_ADMINISTRATION_PATH } from '../../../common/urls/administration-urls';

import { ButtonSize, LinkButton, LinkButtonType } from './Button';

interface IAdministrationLinkProps {
    text: string;
    to: string;
    type?: LinkButtonType;
    className?: string;
}

const AdministrationLink = ({ text, to, type, className }: IAdministrationLinkProps) => (
    <LinkButton
      text={text}
      size={ButtonSize.small}
      type={type ?? LinkButtonType.secondary}
      to={`/${NEW_ADMINISTRATION_PATH}${to.startsWith('/')
          ? ''
          : '/'}${to}`}
      isToExternal
      className={className}
    />
);

export default AdministrationLink;
