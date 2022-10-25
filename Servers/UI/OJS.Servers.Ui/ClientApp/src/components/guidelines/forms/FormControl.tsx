import React, { ChangeEvent, FormEvent, useState } from 'react';
import isNil from 'lodash/isNil';

import concatClassNames from '../../../utils/class-names';
import generateId from '../../../utils/id-generator';
import { ClassNameType, IHaveChildrenProps, IHaveOptionalClassName } from '../../common/Props';

import styles from './FormControl.module.scss';

enum FormControlType {
    'radio' = 'radio',
    'checkbox' = 'checkbox',
    'text' = 'text',
    'textarea' = 'textarea',
    'input' = 'input',
    'password' = 'password',
}

type TextAreaOrInputElement = HTMLTextAreaElement | HTMLInputElement;

interface IFormControlProps extends IHaveOptionalClassName {
    name: string;
    value?: string;
    containerClassName?: string;
    labelText?: string;
    labelClassName?: ClassNameType;
    type?: FormControlType;
    onChange?: ((value?: string) => void) | null;
    onInput?: ((value?: string) => void) | null;
    checked?: boolean;
    id?: string;
}

interface ILabelInternalProps extends IHaveChildrenProps, IHaveOptionalClassName {
    id: string;
    forKey: string;
    text: string;
    fieldType: FormControlType;
    internalContainerClassName?: string;

}

const LabelInternal = ({ id, text, className, internalContainerClassName, forKey, children, fieldType }: ILabelInternalProps) => {
    if (!text && !className) {
        return (
            <div>
                {children}
            </div>
        );
    }

    const containerClassname = concatClassNames(
        fieldType !== FormControlType.checkbox
            ? styles.formControlContainer
            : null,
        internalContainerClassName,
    );
    const componentClassName = concatClassNames(
        fieldType !== FormControlType.checkbox
            ? styles.formLabel
            : null,
        className,
    );

    return (
        <div className={containerClassname}>
            {children}
            <label id={id} className={componentClassName} htmlFor={forKey}>
                <span>{text}</span>
            </label>
        </div>
    );
};

const FormControl = ({
    name,
    value = '',
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    onChange = null,
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    onInput = null,
    className = '',
    containerClassName = '',
    labelText = '',
    labelClassName = '',
    type = FormControlType.text,
    checked = false,
    id = generateId(),
}: IFormControlProps) => {
    const [ formControlValue, setFormControlValue ] = useState(value);
    const [ isChecked, setIsChecked ] = useState<boolean>(checked);

    const componentClassName = concatClassNames(type !== FormControlType.checkbox
        ? styles.formControl
        : null, className);

    const handleOnChange = (ev: ChangeEvent<TextAreaOrInputElement>) => {
        if (type === FormControlType.checkbox) {
            setIsChecked(!isChecked);

            return;
        }

        setFormControlValue(ev.target.value);

        if (isNil(onChange)) {
            return;
        }

        onChange(ev.target.value);
    };

    const handleOnInput = (ev: FormEvent<TextAreaOrInputElement>) => {
        const element = ev.target as TextAreaOrInputElement;

        setFormControlValue(element.value);

        if (isNil(onInput)) {
            return;
        }

        onInput(element.value);
    };

    const generateFormControl = () => {
        if (type === FormControlType.textarea) {
            return (
                <textarea
                  className={concatClassNames(componentClassName, styles.formControlTextArea)}
                  name={name}
                  id={id}
                  onChange={handleOnChange}
                  onInput={handleOnInput}
                  value={formControlValue}
                  placeholder={labelText}
                />
            );
        }

        if (type === FormControlType.checkbox) {
            return (
                <input
                  type={type}
                  className={componentClassName}
                  name={name}
                  id={id}
                  checked={isChecked}
                  onChange={handleOnChange}
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
              placeholder={labelText}
            />
        );
    };

    return (
        <LabelInternal
          id={`${id}-label`}
          text={labelText}
          fieldType={type}
          internalContainerClassName={containerClassName}
          className={labelClassName}
          forKey={id}
        >
            {generateFormControl()}
        </LabelInternal>
    );
};

export default FormControl;

export {
    FormControlType,
};
