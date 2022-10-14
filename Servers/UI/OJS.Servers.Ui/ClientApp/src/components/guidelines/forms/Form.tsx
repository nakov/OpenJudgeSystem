import React, { FormEvent, useCallback, useMemo } from 'react';

import concatClassNames from '../../../utils/class-names';
import generateId from '../../../utils/id-generator';
import { IHaveChildrenProps, IHaveOptionalClassName } from '../../common/Props';
import { Button, ButtonType } from '../buttons/Button';

interface IFormProps extends IHaveChildrenProps, IHaveOptionalClassName {
    onSubmit: () => void;
    submitText?: string;
    id?: string;
}

const Form = ({
    onSubmit,
    children,
    submitText = 'Submit',
    id = generateId(),
    className = '',
}: IFormProps) => {
    const handleSubmit = useCallback(
        async (ev: FormEvent) => {
            ev.preventDefault();
            onSubmit();

            return false;
        },
        [ onSubmit ],
    );

    const btnId = useMemo(
        () => `btn-submit-${id}`,
        [ id ],
    );

    const internalClassName = concatClassNames(className);

    return (
        <form id={id}
              onSubmit={(ev) => handleSubmit(ev)}
              className={internalClassName}>
            {children}
            <Button
                id={btnId}
                onClick={(ev) => handleSubmit(ev)}
                text={submitText}
                type={ButtonType.submit}
            />
        </form>
    );
};

export default Form;
