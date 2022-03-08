import * as React from 'react';
import { useCallback, useState } from 'react';
import styles from './ExecutionTypeSelector.module.scss';
import { Button } from '../../guidelines/buttons/Button';
import { useContests } from '../../../hooks/contests/use-contests';

interface IExecutionTypeSelectorProps {
    id: number,
    value: string
    isSelected: boolean,
    onSelect: () => void;
}

const ExecutionTypeSelector = ({ id, value, isSelected, onSelect }: IExecutionTypeSelectorProps) => {
    const [ selected, setSelected ] = useState(isSelected);
    const { selectedSubmissionTypeId } = useContests();

    // eslint-disable-next-line eqeqeq
    const getClassName = useCallback(() => (selectedSubmissionTypeId == id
        ? styles.executionTypeSelectorActive
        : styles.executionTypeSelectorInactive), [ id, selectedSubmissionTypeId ]);

    const select = useCallback(() => {
        onSelect();
        setSelected(!selected);
    }, [ onSelect, selected ]);

    return (
        // eslint-disable-next-line max-len
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
        <Button
          type="plain"
          className={getClassName()}
          onClick={select}
        >
            {value}
        </Button>
    );
};

export default ExecutionTypeSelector;
