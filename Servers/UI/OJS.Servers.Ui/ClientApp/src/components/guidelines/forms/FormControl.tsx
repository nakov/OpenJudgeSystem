import React, { ChangeEvent, FormEvent, useCallback, useState } from 'react';
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
    onClick?: (value: FormEvent<HTMLInputElement>) => void;
    checked?: boolean;
    id?: string;
    shouldDisableLabel?: boolean;
    showPlaceholder?: boolean;
}

interface ILabelInternalProps extends IHaveChildrenProps, IHaveOptionalClassName {
    id: string;
    forKey: string;
    text: string;
    fieldType: FormControlType;
    internalContainerClassName?: string;
}

const LabelInternal = ({
    id,
    text,
    className,
    internalContainerClassName,
    forKey,
    children,
    fieldType,
}: ILabelInternalProps) => {
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
    onClick,
    className = '',
    containerClassName = '',
    labelText = '',
    labelClassName = '',
    type = FormControlType.text,
    checked = false,
    id = generateId(),
    shouldDisableLabel = false,
    showPlaceholder = true,
}: IFormControlProps) => {
    const [ formControlValue, setFormControlValue ] = useState(value);

    const [ isChecked, setIsChecked ] = useState<boolean>(checked);

    const componentClassName = concatClassNames(type !== FormControlType.checkbox
        ? styles.formControl
        : null, className);

    const handleOnChange = useCallback(
        (ev: ChangeEvent<TextAreaOrInputElement>) => {
            if (type === FormControlType.checkbox) {
                setIsChecked(!isChecked);

                return;
            }

            setFormControlValue(ev.target.value);

            if (isNil(onChange)) {
                return;
            }

            onChange(ev.target.value as string);
        },
        [ isChecked, onChange, type ],
    );

    const handleOnInput = useCallback(
        (ev: FormEvent<TextAreaOrInputElement>) => {
            const element = ev.target as TextAreaOrInputElement;

            setFormControlValue(element.value);

            if (isNil(onInput)) {
                return;
            }

            onInput(element.value);
        },
        [ onInput ],
    );

    const generateFormControl = useCallback(
        () => {
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
                      value={value}
                      checked={isChecked}
                      onClick={onClick}
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
                  placeholder={showPlaceholder
                      ? labelText
                      : undefined}
                />
            );
        },
        [ checked, componentClassName, formControlValue, handleOnChange, handleOnInput, id,
            isChecked, labelText, name, onChange, onClick, showPlaceholder, type, value ],
    );

    const generateFormControlWithLabel = useCallback(
        () => (
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
        ),
        [ containerClassName, generateFormControl, id, labelClassName, labelText, type ],
    );

    const renderFormControl = useCallback(
        () => shouldDisableLabel
            ? generateFormControl()
            : generateFormControlWithLabel(),
        [ shouldDisableLabel, generateFormControlWithLabel, generateFormControl ],
    );

    return (
        renderFormControl()
    );
};

export default FormControl;

export type {
    IFormControlOnChangeValueType,
};

export {
    FormControlType,
};
