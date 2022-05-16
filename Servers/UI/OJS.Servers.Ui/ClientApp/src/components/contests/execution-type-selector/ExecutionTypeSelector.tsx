import * as React from 'react';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { get } from 'lodash';
import styles from './ExecutionTypeSelector.module.scss';
import { Button, ButtonType } from '../../guidelines/buttons/Button';
import { useSubmissions } from '../../../hooks/submissions/use-submissions';
import concatClassNames from '../../../utils/class-names';

interface IExecutionTypeSelectorProps {
    id: number,
    value: string
    isSelected: boolean,
    onSelect: () => void;
}

const ExecutionTypeSelector = ({ id, value, isSelected, onSelect }: IExecutionTypeSelectorProps) => {
    const [ selected, setSelected ] = useState(isSelected);
    const [ executionTypeSelectorClassName, setExecutionTypeSelectorClassName ] = useState('');
    const { state: { selectedSubmissionType } } = useSubmissions();

    const selectedSubmissionTypeId = useMemo(
        () => get(selectedSubmissionType, 'id', null),
        [ selectedSubmissionType ],
    );

    const executionTypeSelectorActiveClass = 'executionTypeSelectorActive';
    const executionTypeSelectorActiveClassName = concatClassNames(
        styles.executionTypeSelectorActive,
        executionTypeSelectorActiveClass,
    );

    const executionTypeSelectorInactiveClass = 'executionTypeSelectorInactive';
    const executionTypeSelectorInactiveClassName = concatClassNames(
        styles.executionTypeSelectorInactive,
        executionTypeSelectorInactiveClass,
    );

    useEffect(
        () => setExecutionTypeSelectorClassName(selectedSubmissionTypeId === id
            ? executionTypeSelectorActiveClassName
            : executionTypeSelectorInactiveClassName),
        [ executionTypeSelectorActiveClassName, executionTypeSelectorInactiveClassName, id, selectedSubmissionTypeId ],
    );

    const select = useCallback(() => {
        onSelect();
        setSelected(!selected);
    }, [ onSelect, selected ]);

    return (
        <Button
          type={ButtonType.plain}
          className={executionTypeSelectorClassName}
          onClick={select}
        >
            {value}
        </Button>
    );
};

export default ExecutionTypeSelector;
