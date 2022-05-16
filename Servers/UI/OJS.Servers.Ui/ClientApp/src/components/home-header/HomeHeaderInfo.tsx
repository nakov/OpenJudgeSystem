import * as React from 'react';
import styles from './HomeHeaderInfo.module.scss';
import Heading from '../guidelines/headings/Heading';
import List from '../guidelines/lists/List';
import { Button, ButtonType } from '../guidelines/buttons/Button';

interface IHomeHeaderInfoProps {
    primaryText: string;
    secondaryText: string;
    bullets: string[];
    onCtaClick?: () => void;
}

const HomeHeaderInfo = ({
    bullets,
    primaryText,
    secondaryText,
    onCtaClick = () => {},
}: IHomeHeaderInfoProps) => {
    const renderBullet = (text: string) => (
        <>
            <i className="fas fa-check-circle" />
            {text}
        </>
    );
    return (
        <>
            <Heading
              id="index-title-heading-h1"
              type="primary"
              className={styles.headerPrimaryHeading}
            >
                {primaryText}
            </Heading>
            <Heading
              id="index-title-heading-h2"
              type="secondary"
            >
                {secondaryText}
            </Heading>
            <List
              values={bullets}
              itemFunc={renderBullet}
              className={styles.headerBulletsWrapper}
              itemClassName={styles.headerBullet}
            />
            <Button
              id="button-see-contests"
              text="See Contests"
              className={styles.headerLeftButton}
              onClick={() => onCtaClick()}
            />
        </>
    );
};

export default HomeHeaderInfo;
