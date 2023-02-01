import React, { useCallback, useMemo } from 'react';

import { LinkButton, LinkButtonType } from '../../components/guidelines/buttons/Button';
import Heading, { HeadingType } from '../../components/guidelines/headings/Heading';
import GithubIcon from '../../components/guidelines/icons/GitHubIcon';
import YouTubeIcon from '../../components/guidelines/icons/YouTubeIcon';

import logo from './softuni-logo-horizontal-white.svg';

import styles from './PageFooter.module.scss';

interface IFooterLinkType {
    text: string;
    url: string;
}

const PageFooter = () => {
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

    const renderLinks = useCallback((links: IFooterLinkType[]) => links.map((l) => (
        <LinkButton
          to={l.url}
          type={LinkButtonType.plain}
          className={styles.link}
        >
            {l.text}
        </LinkButton>
    )), []);

    const renderLearnSection = useCallback(() => (
        <div className={styles.footerLearnLinksWrapper}>
            <Heading
              type={HeadingType.secondary}
              className={styles.sectionHeading}
            >
                Learn
            </Heading>
            {renderLinks(learnLinks)}
        </div>
    ), [ learnLinks, renderLinks ]);

    const renderAboutSection = useCallback(() => (
        <div className={styles.footerAboutLinksWrapper}>
            <Heading
              type={HeadingType.secondary}
              className={styles.sectionHeading}
            >
                About
            </Heading>
            {renderLinks(aboutLinks)}
        </div>
    ), [ aboutLinks, renderLinks ]);

    const renderSystemInfoAndLinksSection = useCallback(() => (
        <div className={styles.systemInfoAndLinksContainer}>
            <span className={styles.systemInfo}>
                © 2011-2023 - Open Judge System (OJS)
            </span>
            <span className={styles.links}>
                <LinkButton
                  to="https://github.com/NikolayIT/OpenJudgeSystem"
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

    const renderLogo = useCallback(() => (
        <div className={styles.footerLogo}>
            <img src={logo} alt="softuni logo" />
        </div>
    ), []);

    return (
        <footer id="pageFooter" className={styles.footer}>
            <div className={styles.content}>
                {renderLogo()}
                {renderLearnSection()}
                {renderAboutSection()}
                {renderSystemInfoAndLinksSection()}
            </div>
        </footer>
    );
};

export default PageFooter;
