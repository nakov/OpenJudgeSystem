import React, { useCallback, useEffect, useState } from 'react';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import { Button, ButtonSize, ButtonType } from './Button';

import styles from './ExpandButton.module.scss';

interface IExpandButtonProps {
    onExpandChanged: (expanded: boolean) => void;
    expandedText?: string,
    collapsedText?: string,
    expandedIcon?: React.ReactElement,
    collapsedIcon?: React.ReactElement,
    expanded?: boolean,
}

const ExpandButton = ({
    expandedText = 'Show less',
    collapsedText = 'Show more',
    expandedIcon = <MdExpandLess />,
    collapsedIcon = <MdExpandMore />,
    onExpandChanged,
    expanded = false,
} : IExpandButtonProps) => {
    const [ expandedInternal, setExpandedInternal ] = useState(expanded);

    const renderButtonText = useCallback(() => (expandedInternal
        ? expandedText
        : collapsedText), [ collapsedText, expandedInternal, expandedText ]);

    const renderButtonIcon = useCallback(() => (expandedInternal
        ? expandedIcon
        : collapsedIcon), [ collapsedIcon, expandedInternal, expandedIcon ]);

    const handleClick = useCallback(
        () => {
            setExpandedInternal(!expandedInternal);
        },
        [ expandedInternal ],
    );

    useEffect(
        () => onExpandChanged(expandedInternal),
        [ expandedInternal, onExpandChanged ],
    );

    useEffect(
        () => setExpandedInternal(expanded),
        [ expanded ],
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
