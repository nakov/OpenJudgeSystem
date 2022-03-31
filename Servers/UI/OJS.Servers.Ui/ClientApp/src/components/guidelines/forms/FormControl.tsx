import * as React from 'react';
import { useState } from 'react';
import concatClassNames from '../../../utils/class-names';
import generateId from '../../../utils/id-generator';
import IHaveChildrenProps from '../../common/IHaveChildrenProps';

import styles from './FormControl.module.scss';

interface IFormControlProps {
    name: string,
    value: string,
    id?: string,
    className?: string | string[],
    labelText?: string,
    labelClassName?: string | string[],
    type?: 'radio' | 'checkbox' | 'text' | 'textarea' | 'input' | 'password',
    onChange?: (value?:string) => void
    onInput?: (value?:string) => void,
    checked?: boolean
}

interface ILabelInternalProps extends IHaveChildrenProps {
    text: string,
    className: string | string[],
    forKey: string,
}

const LabelInternal = ({ id, text, className, forKey, children }: ILabelInternalProps) => {
    if (!text && !className) {
        return (
            <>
                {children}
            </>
        );
    }

    const componentClassName = concatClassNames(className, styles.formLabel);

    return (
        <div className={styles.formControlContainer}>
            {children}
            <label className={componentClassName} htmlFor={forKey}>
                <span>{text}</span>
            </label>
        </div>
    );
};

const FormControl = ({
    name,
    value,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onChange = (v?:string) => { },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onInput = (v?:string) => { },
    className = '',
    labelText = '',
    labelClassName = '',
    type = 'text',
    checked = false,
}: IFormControlProps) => {
    const [ formControlValue, setFormControlValue ] = useState(value);

    const id = generateId();
    const componentClassName = concatClassNames(styles.formControl, className);
    const handleOnChange = (ev:any) => {
        setFormControlValue(ev.target.value);
        onChange(ev.target.value);
    };
    const handleOnInput = (ev:any) => {
        setFormControlValue(ev.target.value);
        onChange(ev.target.value);
    };

    const generateFormControl = () => {
        if (type === 'textarea') {
            return (
                <textarea
                  className={concatClassNames(componentClassName, styles.formControlTextArea)}
                  name={name}
                  id={id}
                  onChange={handleOnChange}
                  onInput={handleOnInput}
                  value={formControlValue}
                />
            );
        }
        return (
            <input
              type={type}
              className={componentClassName}
              name={name}
              id={id}
              onChange={handleOnChange}
              onInput={handleOnInput}
              value={formControlValue}
              checked={checked}
            />
        );
    };

    return (
        <LabelInternal text={labelText} className={labelClassName} forKey={id}>
            {generateFormControl()}
        </LabelInternal>
    );
};

export default FormControl;
