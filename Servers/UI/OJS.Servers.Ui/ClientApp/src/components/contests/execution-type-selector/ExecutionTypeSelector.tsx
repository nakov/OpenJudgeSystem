import * as React from 'react';
import { useState } from 'react';
import styles from './ExecutionTypeSelector.module.scss';
import { Button } from '../../guidelines/buttons/Button';

interface IExecutionTypeSelectorProps {
    value: string
    isSelected: boolean,
    onSelect: () => void;
}

const ExecutionTypeSelector = ({ value, isSelected, onSelect }: IExecutionTypeSelectorProps) => {
    const [ selected, setSelected ] = useState(isSelected);

    const className = selected
        ? styles.executionTypeSelectorActive
        : styles.executionTypeSelectorInactive;

    const select = () => {
        onSelect();
        setSelected(!selected);
    };

    return (
        // eslint-disable-next-line max-len
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
        <Button
          type="plain"
          className={className}
          onClick={select}
        >
            {value}
        </Button>
    );
};

export default ExecutionTypeSelector;
