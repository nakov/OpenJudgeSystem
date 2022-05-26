import React, { useCallback, useState } from 'react';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import { Button, ButtonSize, ButtonType } from './Button';

import styles from './ExpandButton.module.scss';

interface IExpandButtonProps {
    expandedText?: string,
    collapsedText?: string,
    expandedIcon?: React.ReactElement,
    collapsedIcon?: React.ReactElement,
    onClick: () => void;
}

const ExpandButton = ({
    expandedText = 'Show less',
    collapsedText = 'Show more',
    expandedIcon = <MdExpandLess />,
    collapsedIcon = <MdExpandMore />,
    onClick,
} : IExpandButtonProps) => {
    const [ expanded, setExpanded ] = useState(false);

    const renderButtonText = useCallback(() => (expanded
        ? expandedText
        : collapsedText), [ collapsedText, expanded, expandedText ]);

    const renderButtonIcon = useCallback(() => (expanded
        ? expandedIcon
        : collapsedIcon), [ collapsedIcon, expanded, expandedIcon ]);

    const handleClick = useCallback(
        () => {
            setExpanded(!expanded);
            onClick();
        },
        [ expanded, onClick ],
    );

    return (
        <div className={styles.container}>
            <Button
              type={ButtonType.plain}
              size={ButtonSize.none}
              onClick={handleClick}
              className={styles.link}
            >
                {renderButtonText()}
                {renderButtonIcon()}
            </Button>
        </div>
    );
};

export default ExpandButton;
