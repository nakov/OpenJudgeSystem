import React, { ChangeEvent, FormEvent, useState } from 'react';
import isNil from 'lodash/isNil';

import concatClassNames from '../../../utils/class-names';
import generateId from '../../../utils/id-generator';
import { ClassNameType, IHaveChildrenProps, IHaveOptionalClassName } from '../../common/Props';

import styles from './FormControl.module.scss';

enum ButtonKeyControl {
    enter = 'Enter'
}

enum RadioSearchValues {
    all = 'All',
    contests = 'Contests',
    problems = 'Problems',
    users = 'Users',
}

enum FormControlType {
    'radio' = 'radio',
    'checkbox' = 'checkbox',
    'text' = 'text',
    'textarea' = 'textarea',
    'input' = 'input',
    'password' = 'password',
    'search' = 'search',
    'file' = 'file'
}

type IFormControlOnChangeValueType = string | Blob;

type TextAreaOrInputElement = HTMLTextAreaElement | HTMLInputElement;

interface IFormControlProps extends IHaveOptionalClassName {
    name: string;
    value?: string;
    containerClassName?: string;
    labelText?: string;
    labelClassName?: ClassNameType;
    type?: FormControlType;
    onChange?: ((value?: IFormControlOnChangeValueType) => void) | null;
    onInput?: ((value?: string) => void) | null;
    onKeyDown?: (ev:React.KeyboardEvent<HTMLInputElement>) => void;
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
    onKeyDown,
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
    const [ selectedValue, setSelectedValue ] = useState<string>(value);

    const componentClassName = concatClassNames(type !== FormControlType.checkbox
        ? styles.formControl
        : null, className);

    const handleOnChange = (ev: ChangeEvent<TextAreaOrInputElement>) => {
        if (type === FormControlType.checkbox) {
            setIsChecked(!isChecked);

            return;
        }

        if (type === FormControlType.radio) {
            setSelectedValue(ev.target.value);
        }

        setFormControlValue(ev.target.value);

        if (isNil(onChange)) {
            return;
        }

        onChange(ev.target.value as string);
    };

    const handleOnInput = (ev: FormEvent<TextAreaOrInputElement>) => {
        const element = ev.target as TextAreaOrInputElement;

        setFormControlValue(element.value);

        if (isNil(onInput)) {
            return;
        }

        onInput(element.value);
    };
    const handleOnKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        if (ev.key === ButtonKeyControl.enter) {
            ev.preventDefault();

            if (onKeyDown) {
                onKeyDown(ev);
            }
        }
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

        if (type === FormControlType.file) {
            return (
                <input
                  type={type}
                  className={concatClassNames(componentClassName, styles.fileInput)}
                  name={name}
                  id={id}
                  onChange={(e) => {
                      if (isNil(onChange)) {
                          return;
                      }

                      const fileBlob = e.target.files?.item(0) as Blob;
                      onChange(fileBlob);
                  }}
                />
            );
        }

        if (type === FormControlType.radio) {
            return (
                <div className={componentClassName}>
                    <label>
                        All
                        <input
                          type={FormControlType.radio}
                          value={RadioSearchValues.all}
                          checked={selectedValue === RadioSearchValues.all}
                          onChange={handleOnChange}
                        />
                    </label>
                    <label>
                        Contests
                        <input
                          type={FormControlType.radio}
                          value={RadioSearchValues.contests}
                          checked={selectedValue === RadioSearchValues.contests}
                          onChange={handleOnChange}
                        />
                    </label>
                    <label>
                        Problems
                        <input
                          type={FormControlType.radio}
                          value={RadioSearchValues.problems}
                          checked={selectedValue === RadioSearchValues.problems}
                          onChange={handleOnChange}
                        />
                    </label>
                    <label>
                        Users
                        <input
                          type={FormControlType.radio}
                          value={RadioSearchValues.users}
                          checked={selectedValue === RadioSearchValues.users}
                          onChange={handleOnChange}
                        />
                    </label>
                </div>
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
              onKeyDown={handleOnKeyDown}
              value={formControlValue}
              checked={checked}
              placeholder={labelText}
            />
        );
    };

    if (type === FormControlType.search || type === FormControlType.radio) {
        return generateFormControl();
    }

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

export type {
    IFormControlOnChangeValueType,
};

export {
    FormControlType,
};
