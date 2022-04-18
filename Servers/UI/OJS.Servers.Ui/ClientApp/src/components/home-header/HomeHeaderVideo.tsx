import * as React from 'react';
import YouTube, { Options } from 'react-youtube';
import styles from './HomeHeaderVideo.module.scss';

interface IHomeHeaderVideoProps {
    videoId: string;
}

const HomeHeaderVideo = ({ videoId }: IHomeHeaderVideoProps) => {
    const opts = {
        height: '292',
        width: '520',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    } as Options;
    return (
        <>
            {/* eslint-disable-next-line max-len */}
            <YouTube
              id="youtube-video"
              containerClassName={styles.youtubePlayer}
                    /* TODO: This should come from the backend */
              videoId={videoId}
              opts={opts}
              onReady={(event) => event.target.pauseVideo()}
            />
        </>
    );
};

export default HomeHeaderVideo;
