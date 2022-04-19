import * as React from 'react';

import styles from './HomeHeader.module.scss';
import HomeHeaderInfo from './HomeHeaderInfo';
import HomeHeaderVideo from './HomeHeaderVideo';

const HomeHeader = () => {
    const bulletTexts = [
        'Solve problems in most popular programming languages',
        'See results right away',
        'Submit algorithms, projects etc.',
    ];

    const primaryHeadingText = 'SoftUni Judge System';
    const secondaryHeadingText = 'Automatic Algorithm Test Platform';

    const videoId = 'IwLET8SDBE4';

    const handleCtaClick = () => {
        alert('See contests!');
    };

    return (
        <div className={styles.header}>
            <div className={styles.headerContent}>
                <div className={styles.headerLeft}>
                    <div className={styles.headerContentWrapper}>
                        <HomeHeaderInfo
                          primaryText={primaryHeadingText}
                          secondaryText={secondaryHeadingText}
                          bullets={bulletTexts}
                          onCtaClick={() => handleCtaClick()}
                        />
                    </div>
                </div>
                <div className={styles.headerRight}>
                    <div className={styles.headerContentWrapper}>
                        <HomeHeaderVideo videoId={videoId} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeHeader;
