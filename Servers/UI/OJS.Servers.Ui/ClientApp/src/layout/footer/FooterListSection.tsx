import React, { useCallback } from 'react';

import { IHaveOptionalClassName } from '../../components/common/Props';
import { LinkButton, LinkButtonType } from '../../components/guidelines/buttons/Button';
import Heading, { HeadingType } from '../../components/guidelines/headings/Heading';
import List, { Orientation } from '../../components/guidelines/lists/List';

import styles from './FooterListSection.module.scss';

interface IFooterLinkType {
    text: string;
    url: string;
}

interface IFooterListSectionProps extends IHaveOptionalClassName {
    links: IFooterLinkType[];
    sectionHeadingText: string;
}

const FooterListSection = ({
    links,
    sectionHeadingText,
} : IFooterListSectionProps) => {
    const renderLink = useCallback((l: IFooterLinkType) => (
        <LinkButton
          to={l.url}
          type={LinkButtonType.plain}
        >
            {l.text}
        </LinkButton>
    ), []);

    return (
        <div className={styles.footerListSection}>
            <Heading
              type={HeadingType.secondary}
              className={styles.sectionHeading}
            >
                {sectionHeadingText}
            </Heading>
            <List
              values={links}
              itemFunc={renderLink}
              itemClassName={styles.link}
              className={styles.linksList}
              orientation={Orientation.vertical}
              wrap
            />
        </div>
    );
};

export default FooterListSection;
