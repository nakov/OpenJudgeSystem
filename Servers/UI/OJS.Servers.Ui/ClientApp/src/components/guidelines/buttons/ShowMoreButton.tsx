import React, {useCallback, useState} from 'react';
import {Button, ButtonSize, ButtonType} from "./Button";
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
            <Button
              type={ButtonType.plain}
              size={ButtonSize.none}
              onClick={onShowMoreClick}
              className={styles.link}
            >
                {buttonText}
                {buttonIcon}
            </Button>
        </div>
    )
}

export default ShowMoreButton;