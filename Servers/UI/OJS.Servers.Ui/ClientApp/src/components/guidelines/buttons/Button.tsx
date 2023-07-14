import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import concatClassNames from '../../../utils/class-names';
import generateId from '../../../utils/id-generator';
import { IHaveOptionalChildrenProps, IHaveOptionalClassName } from '../../common/Props';

import styles from './Button.module.scss';

enum ButtonState {
    enabled = 1,
    disabled = 2,
}

enum ButtonType {
    primary = 1,
    secondary = 2,
    plain = 3,
    image = 4,
    submit = 5,
}

enum LinkButtonType {
    primary = 1,
    secondary = 2,
    plain = 3,
    image = 4,
}

enum ButtonSize {
    small = 1,
    medium = 2,
    large = 3,
    none = 4,
}

interface IButtonBaseProps<TButtonType> extends IHaveOptionalClassName, IHaveOptionalChildrenProps {
    id?: string;
    size?: ButtonSize;
    text?: string | null;
    type?: TButtonType;
    state?: ButtonState;
    imgSrc?: string;
    altText?: string;
}

interface IButtonProps extends IButtonBaseProps<ButtonType> {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    isWide?: boolean;
    internalClassName?: string;
}

interface ILinkButtonProps extends IButtonBaseProps<LinkButtonType> {
    to: string;
    isToExternal?: boolean;
}

const classNameToButonType = {
    [ButtonType.primary]: styles.primary,
    [ButtonType.submit]: styles.primary,
    [ButtonType.secondary]: styles.secondary,
    [ButtonType.plain]: styles.plain,
    [ButtonType.image]: styles.image,
};

const classNameToLinkButonType = {
    [LinkButtonType.primary]: styles.primary,
    [LinkButtonType.secondary]: styles.secondary,
    [LinkButtonType.plain]: styles.plain,
    [LinkButtonType.image]: styles.image,
};

const sizeToClassName = {
    [ButtonSize.small]: styles.small,
    [ButtonSize.medium]: styles.medium,
    [ButtonSize.large]: styles.large,
    [ButtonSize.none]: styles.none,
};

const validateOnlyChildrenOrText = (text: string | null, children: ReactNode | null) => {
    if (!isNil(text) && !isNil(children)) {
        throw new Error('Buttons must have only `text` or `children`');
    }
};

const Button = ({
    onClick,
    text = null,
    children = null,
    className = '',
    type = ButtonType.primary,
    size = ButtonSize.medium,
    id = generateId(),
    state = ButtonState.enabled,
    isWide = false,
    internalClassName = '',
    imgSrc = '',
    altText = '',
}: IButtonProps) => {
    validateOnlyChildrenOrText(text, children);

    const { [type]: typeClassName } = classNameToButonType;

    const { [size]: sizeClassName } = sizeToClassName;

    const stateClassName = state === ButtonState.disabled
        ? styles.disabled
        : '';

    const wideClassName = isWide
        ? styles.wide
        : '';

    const buttonClassName =
        isEmpty(internalClassName)
            ? concatClassNames(
                styles.btn,
                typeClassName,
                sizeClassName,
                stateClassName,
                wideClassName,
                className,
            )
            : internalClassName;

    const content = type === ButtonType.image
        ? <img src={imgSrc} alt={altText} />
        : children ?? text;

    return (
        <button
          type={type === ButtonType.submit
              ? 'submit'
              : 'button'}
          onClick={onClick}
          className={buttonClassName}
          id={id}
        >
            {content}
        </button>
    );
};

const LinkButton = ({
    to,
    text = null,
    children = null,
    className = '',
    type = LinkButtonType.primary,
    size = ButtonSize.medium,
    id = generateId(),
    state = ButtonState.enabled,
    isToExternal = false,
    imgSrc = '',
    altText = '',
}: ILinkButtonProps) => {
    validateOnlyChildrenOrText(text, children);
    const isDisabled = state === ButtonState.disabled;

    const { [type]: typeClassName } = classNameToLinkButonType;

    const { [size]: sizeClassName } = sizeToClassName;

    const stateClassName = isDisabled
        ? styles.disabled
        : '';

    const buttonClassName = concatClassNames(
        styles.btn,
        typeClassName,
        sizeClassName,
        stateClassName,
        className,
    );

    const content = type === LinkButtonType.image
        ? <img src={imgSrc} alt={altText} />
        : children ?? text;

    const toHref = isToExternal
        ? { pathname: to }
        : to;

    const target = isToExternal
        ? '_blank'
        : '';

    return (
        <Link
          to={toHref}
          className={buttonClassName}
          id={id}
          target={target}
        >
            {content}
        </Link>
    );
};

export default Button;

export {
    Button,
    LinkButton,
    ButtonType,
    LinkButtonType,
    ButtonSize,
    ButtonState,
};
