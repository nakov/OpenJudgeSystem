import * as React from 'react';

import YouTube, { Options } from 'react-youtube';
import Heading from '../guidelines/headings/Heading';
import { Button } from '../guidelines/buttons/Button';
import styles from './HomeHeader.module.scss';

const HomeHeader = () => {
    const opts = {
        height: '292',
        width: '520',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    } as Options;

    return (
        <div className={styles.header}>
            <div className={styles.headerContent}>
                <div className={styles.headerLeft}>
                    <div className={styles.headerContentWrapper}>
                        <Heading
                          id="index-title-heading-h1"
                          type="primary"
                          className={styles.headerPrimaryHeading}
                        >
                            SoftUni Judge System
                        </Heading>
                        <Heading
                          id="index-title-heading-h2"
                          type="secondary"
                        >
                            Automatic Algorithm Test Platform
                        </Heading>
                        <div className={styles.headerBulletsWrapper}>
                            <div className={styles.headerBullet}>
                                <i className="fas fa-check-circle" />
                                Solve problems in most popular programming languages
                            </div>
                            <div className={styles.headerBullet}>
                                <i className="fas fa-check-circle" />
                                See results right away
                            </div>
                            <div className={styles.headerBullet}>
                                <i className="fas fa-check-circle" />
                                Submit algorithms, projects etc.
                            </div>
                        </div>
                        <Button
                          id="button-see-contests"
                          type="primary"
                          text="See Contests"
                          className={styles.headerLeftButton}
                          onClick={() => {
                          }}
                        />
                    </div>
                </div>
                <div className={styles.headerRight}>
                    <div className={styles.headerContentWrapper}>
                        {/* eslint-disable-next-line max-len */}
                        <YouTube id="youtube-video" containerClassName={styles.youtubePlayer} videoId="IwLET8SDBE4" opts={opts} onReady={(event) => event.target.pauseVideo()} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeHeader;
