import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { get } from 'lodash';
import styles from './ExecutionTypeSelector.module.scss';
import { Button } from '../../guidelines/buttons/Button';
import { useSubmissions } from '../../../hooks/submissions/use-submissions';

interface IExecutionTypeSelectorProps {
    id: number,
    value: string
    isSelected: boolean,
    onSelect: () => void;
}

const ExecutionTypeSelector = ({ id, value, isSelected, onSelect }: IExecutionTypeSelectorProps) => {
    const [ selected, setSelected ] = useState(isSelected);
    const { state: { selectedSubmissionType } } = useSubmissions();
    const selectedSubmissionTypeId = useMemo(
        () => get(selectedSubmissionType, 'id', null),
        [ selectedSubmissionType ],
    );

    const getClassName = useCallback(
        () => (selectedSubmissionTypeId === id
            ? styles.executionTypeSelectorActive
            : styles.executionTypeSelectorInactive),
        [ id, selectedSubmissionTypeId ],
    );

    const select = useCallback(() => {
        onSelect();
        setSelected(!selected);
    }, [ onSelect, selected ]);

    return (
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
