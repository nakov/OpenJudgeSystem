import { FaExternalLinkAlt } from 'react-icons/fa';

import { ButtonSize, LinkButton, LinkButtonType } from './Button';

import styles from './ExternalLink.module.scss';

interface IExternalLinkProps {
    text: string;
    to: string;
}

const ExternalLink = ({ text, to }: IExternalLinkProps) => (
    <LinkButton
      size={ButtonSize.small}
      type={LinkButtonType.plain}
      to={to}
      isToExternal
      internalClassName={styles.externalLink}
    >
        {text}
        <FaExternalLinkAlt className={styles.externalIcon} />
    </LinkButton>
);

export default ExternalLink;
