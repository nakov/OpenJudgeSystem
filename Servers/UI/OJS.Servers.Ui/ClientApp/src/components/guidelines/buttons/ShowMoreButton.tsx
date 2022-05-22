import React, {useCallback, useState} from 'react';
import {LinkButton} from "./Button";
import {MdExpandLess, MdExpandMore} from "react-icons/md";

import styles from './ShowMoreButton.module.scss'
interface IShowMoreButtonProps {
    onClick: () => void;
}

const ShowMoreButton = ({
    onClick,
} : IShowMoreButtonProps) => {
    const [ showMore, setShowMore] = useState(false);
    
    const buttonText = showMore
        ? "Show less"
        : "Show more";
    
    const buttonIcon = showMore
        ? <MdExpandLess/>
        : <MdExpandMore/>;
    
    const onShowMoreClick = useCallback(
        () => {
            setShowMore(!showMore);
            onClick();
        },
        [showMore],
    );

    return (
        <div className={styles.container}>
            <LinkButton
              text={buttonText}
              to={'#'}
              type={'link'} onClick={onShowMoreClick}
              className={styles.link}
            >
                {buttonIcon}
            </LinkButton>
        </div>
    )
}

export default ShowMoreButton;