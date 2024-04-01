import React, { useCallback, useMemo } from 'react';

import logo from '../../assets/softuni-logo-horizontal-white.svg';
import { LinkButton, LinkButtonType } from '../../components/guidelines/buttons/Button';
import GithubIcon from '../../components/guidelines/icons/GitHubIcon';
import YouTubeIcon from '../../components/guidelines/icons/YouTubeIcon';

import FooterListSection from './FooterListSection';

import styles from './FooterNavigation.module.scss';

interface IFooterLinkType {
    text: string;
    url: string;
}

const FooterNavigation = () => {
    const learnLinks = useMemo(() => Array.from<IFooterLinkType>([
        {
            text: 'Professional Programs',
            url: 'https://learn.softuni.org/catalog#program',
        },
        {
            text: 'Courses',
            url: 'https://learn.softuni.org/catalog#opencourse',
        },
        {
            text: 'Open Lessons',
            url: 'https://learn.softuni.org/catalog#openlesson',
        } ]), []);

    const aboutLinks = useMemo(() => Array.from<IFooterLinkType>([
        {
            text: 'Contact us',
            url: 'https://learn.softuni.org/contact',
        },
        {
            text: 'Careers',
            url: 'https://learn.softuni.org/careers',
        },
        {
            text: 'Blog',
            url: 'https://softuni.org/',
        } ]), []);

    const renderSystemInfoAndLinksSection = useCallback(() => (
        <div className={styles.systemInfoAndLinksContainer}>
            <span className={styles.systemInfo}>
                © 2011-2023 - Open Judge System (OJS)
            </span>
            <span className={styles.links}>
                <LinkButton
                  to="https://github.com/SoftUni-Internal/OpenJudgeSystem"
                  type={LinkButtonType.plain}
                  isToExternal
                >
                    <GithubIcon />
                </LinkButton>
                <LinkButton
                  to="https://www.youtube.com/channel/UCqvOk8tYzfRS-eDy4vs3UyA"
                  type={LinkButtonType.plain}
                  isToExternal
                >
                    <YouTubeIcon />
                </LinkButton>
            </span>
        </div>
    ), []);

    return (
        <div className={styles.content}>
            <LinkButton
              to="/"
              type={LinkButtonType.image}
              className={styles.footerLogo}
              altText="Softuni logo"
              imgSrc={logo}
            />
            <FooterListSection
              links={learnLinks}
              sectionHeadingText="Learn"
            />
            <FooterListSection
              links={aboutLinks}
              sectionHeadingText="About"
            />
            {renderSystemInfoAndLinksSection()}
        </div>
    );
};

export default FooterNavigation;
