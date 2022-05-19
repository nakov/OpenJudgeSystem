import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { get } from 'lodash';
import styles from './ExecutionTypeSelector.module.scss';
import { Button, ButtonSize, ButtonType } from '../../guidelines/buttons/Button';
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
        styles.executionTypeSelector,
        styles.active,
        executionTypeSelectorActiveClass,
    );

    const executionTypeSelectorInactiveClass = 'executionTypeSelectorInactive';
    const executionTypeSelectorInactiveClassName = concatClassNames(
        styles.executionTypeSelector,
        styles.inactive,
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
          type={ButtonType.secondary}
          size={ButtonSize.small}
          className={executionTypeSelectorClassName}
          onClick={select}
        >
            {value}
        </Button>
    );
};

export default ExecutionTypeSelector;
