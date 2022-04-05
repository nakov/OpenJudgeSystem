import * as React from 'react';
import IHaveChildrenProps from '../../common/IHaveChildrenProps';
import { Button } from '../buttons/Button';
import generateId from '../../../utils/id-generator';

interface IFormProps extends IHaveChildrenProps {
    onSubmit: () => {};
    submitText?: string;
    id?: string;
}

const Form = ({
    onSubmit,
    children,
    submitText = 'Submit',
    id = generateId(),
}: IFormProps) => {
    const handleSubmit = async (ev: any) => {
        ev.preventDefault();
        onSubmit();
        return false;
    };

    return (
        <form id={id} onSubmit={(ev) => handleSubmit(ev)}>
            {children}
            <Button
              id="$btn-submit-{id}"
              onClick={(ev) => handleSubmit(ev)}
              text={submitText}
              type="submit"
            />
        </form>
    );
};

export default Form;
