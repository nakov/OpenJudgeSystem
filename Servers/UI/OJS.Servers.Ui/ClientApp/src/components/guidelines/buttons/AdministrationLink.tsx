import { NEW_ADMINISTRATION_PATH } from '../../../common/urls/administration-urls';

import { ButtonSize, LinkButton, LinkButtonType } from './Button';

interface IAdministrationLinkProps {
    text: string;
    to: string;
}

const AdministrationLink = ({ text, to }: IAdministrationLinkProps) => (
    <LinkButton
      text={text}
      size={ButtonSize.small}
      type={LinkButtonType.secondary}
      to={`/${NEW_ADMINISTRATION_PATH}${to.startsWith('/')
          ? ''
          : '/'}${to}`}
      isToExternal
    />
);

export default AdministrationLink;
