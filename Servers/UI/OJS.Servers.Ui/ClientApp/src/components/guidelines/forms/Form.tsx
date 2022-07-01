import * as React from 'react';
import { useCallback, useMemo } from 'react';
import { IHaveChildrenProps } from '../../common/Props';
import { Button, ButtonType } from '../buttons/Button';
import generateId from '../../../utils/id-generator';

interface IFormProps extends IHaveChildrenProps {
    onSubmit: () => void;
    submitText?: string;
    id?: string;
}

const Form = ({
    onSubmit,
    children,
    submitText = 'Submit',
    id = generateId(),
}: IFormProps) => {
    const handleSubmit = useCallback(
        async (ev: any) => {
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

    return (
        <form id={id} onSubmit={(ev) => handleSubmit(ev)}>
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
