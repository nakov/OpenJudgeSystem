import React, {useCallback, useState} from 'react';
import {Button, ButtonSize, ButtonType} from "./Button";
import {MdExpandLess, MdExpandMore} from "react-icons/md";

import styles from './ShowMoreButton.module.scss'

interface IShowMoreButtonProps {
    expandedText?: string,
    collapsedText?: string,
    expandedIcon?: React.ReactElement,
    collapsedIcon?: React.ReactElement,
    onClick: () => void;
}

const ShowMoreButton = ({
    expandedText = "Show less",
    collapsedText = "Show more",
    expandedIcon = <MdExpandLess/>,
    collapsedIcon = <MdExpandMore/>,
    onClick,
} : IShowMoreButtonProps) => {
    const [ expanded, setExpanded] = useState(false);
    
    const renderButtonText = useCallback(() => {
        return expanded
            ? expandedText
            : collapsedText
    },[expanded]);
    
    const renderButtonIcon = useCallback(() => {
        return expanded
            ? expandedIcon
            : collapsedIcon
    }, [expanded]);
    
    const onExpandClick = useCallback(
        () => {
            setExpanded(!expanded);
            onClick();
        },
        [expanded],
    );

    return (
        <div className={styles.container}>
            <Button
              type={ButtonType.plain}
              size={ButtonSize.none}
              onClick={onExpandClick}
              className={styles.link}
            >
                {renderButtonText()}
                {renderButtonIcon()}
            </Button>
        </div>
    )
}

export default ShowMoreButton;