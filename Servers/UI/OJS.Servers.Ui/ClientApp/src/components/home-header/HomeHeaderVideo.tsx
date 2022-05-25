import React from 'react';
import YouTube from 'react-youtube';
import styles from './HomeHeaderVideo.module.scss';

interface IHomeHeaderVideoProps {
    videoId: string;
}

const HomeHeaderVideo = ({ videoId }: IHomeHeaderVideoProps) => {
    const options = {
        height: '292',
        width: '520',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    };
    return (
        <>
            <YouTube
              id="youtube-video"
              iframeClassName={styles.youtubePlayer}
              videoId={videoId}
              opts={options}
              onReady={(event) => event.target.pauseVideo()}
            />
        </>
    );
};

export default HomeHeaderVideo;
