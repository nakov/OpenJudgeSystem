/* eslint-disable css-modules/no-unused-class */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import YouTube from 'react-youtube';
import styles from './HomeHeaderVideo.module.scss';

interface IHomeHeaderVideoProps {
    videoId: string;
}

const HomeHeaderVideo = ({ videoId }: IHomeHeaderVideoProps) => (
    <>
        {/* <YouTube
          id="youtube-video"
          className={styles.youtubePlayer}
          videoId={videoId}
          opts={{
              height: '292',
              width: '520',
              playerVars: { autoplay: 0 },
          }}
          onReady={(event) => event.target.pauseVideo()}
        /> */}
    </>
);

export default HomeHeaderVideo;
