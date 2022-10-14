import React, { useCallback, useMemo, useState } from 'react';
import get from 'lodash/get';

import { useSubmissions } from '../../../hooks/submissions/use-submissions';
import concatClassNames from '../../../utils/class-names';
import { Button, ButtonSize, ButtonState, ButtonType } from '../../guidelines/buttons/Button';

import styles from './ExecutionTypeSelector.module.scss';

interface IExecutionTypeSelectorProps {
    id: number;
    value: string;
    isSelected: boolean;
    onSelect: () => void;
}

const ExecutionTypeSelector = ({ id, value, isSelected, onSelect }: IExecutionTypeSelectorProps) => {
    const [ selected, setSelected ] = useState(isSelected);
    const { state: { selectedSubmissionType } } = useSubmissions();

    const selectedSubmissionTypeId = useMemo(
        () => get(selectedSubmissionType, 'id', null),
        [ selectedSubmissionType ],
    );

    const executionTypeSelectorActiveClass = 'executionTypeSelectorActive';
    const executionTypeSelectorInactiveClass = 'executionTypeSelectorInactive';
    const stateClassName = useMemo(
        () => selectedSubmissionTypeId === id
            ? executionTypeSelectorActiveClass
            : executionTypeSelectorInactiveClass,
        [ id, selectedSubmissionTypeId ],
    );
    const executionTypeSelectorClassName = concatClassNames(
        styles.executionTypeSelector,
        stateClassName,
    );

    const buttonState = useMemo(
        () => selectedSubmissionTypeId === id
            ? ButtonState.disabled
            : ButtonState.enabled,
        [ id, selectedSubmissionTypeId ],
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
          state={buttonState}
          onClick={select}
        >
            {value}
        </Button>
    );
};

export default ExecutionTypeSelector;
