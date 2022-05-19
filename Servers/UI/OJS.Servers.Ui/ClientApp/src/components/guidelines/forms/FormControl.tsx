import * as React from 'react';
import { useState } from 'react';
import concatClassNames from '../../../utils/class-names';
import generateId from '../../../utils/id-generator';
import { ClassNameType, IHaveChildrenProps, IHaveOptionalClassName } from '../../common/Props';

import styles from './FormControl.module.scss';

interface IFormControlProps extends IHaveOptionalClassName{
    name: string;
    value: string;
    labelText?: string;
    labelClassName?: ClassNameType;
    type?: 'radio' | 'checkbox' | 'text' | 'textarea' | 'input' | 'password';
    onChange?: (value?:string) => void;
    onInput?: (value?:string) => void;
    checked?: boolean;
    id?: string;
}

interface ILabelInternalProps extends IHaveChildrenProps, IHaveOptionalClassName {
    text: string;
    forKey: string;
    id: string;
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
            <label id={id} className={componentClassName} htmlFor={forKey}>
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
    id = generateId(),
}: IFormControlProps) => {
    const [ formControlValue, setFormControlValue ] = useState(value);

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
        <LabelInternal id={`${id}-label`} text={labelText} className={labelClassName} forKey={id}>
            {generateFormControl()}
        </LabelInternal>
    );
};

export default FormControl;
