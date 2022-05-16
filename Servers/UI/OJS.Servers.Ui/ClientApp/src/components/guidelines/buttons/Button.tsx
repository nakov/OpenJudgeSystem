import * as React from 'react';
import { Link } from 'react-router-dom';
import { isNil } from 'lodash';
import { ReactNode } from 'react';
import concatClassNames from '../../../utils/class-names';
import { IHaveOptionalChildrenProps, IHaveOptionalClassName } from '../../common/Props';
import generateId from '../../../utils/id-generator';

import styles from './Button.module.scss';

enum ButtonState {
    enabled = 'active',
    disabled = 'disabled',
}

enum ButtonType {
    primary = 'primary',
    secondary = 'secondary',
    plain = 'plain',
    submit = 'submit',
}

enum LinkButtonType {
    primary = 'primary',
    secondary = 'secondary',
    plain = 'plain',
}

enum ButtonSize {
    small = 'small',
    medium = 'medium',
    large = 'large',
}

interface IButtonBaseProps<TButtonType> extends IHaveOptionalClassName, IHaveOptionalChildrenProps {
    id?: string;
    size?: ButtonSize;
    text?: string,
    type?: TButtonType;
    state?: ButtonState;
}

interface IButtonProps extends IButtonBaseProps<ButtonType> {
    onClick: React.MouseEventHandler<HTMLButtonElement>,
}

interface ILinkButtonProps extends IButtonBaseProps<LinkButtonType> {
    to: string;
}

const classNameToType = {
    [ButtonType.primary]: styles.primary,
    [ButtonType.submit]: styles.primary,
    [ButtonType.secondary]: styles.secondary,
    [ButtonType.plain]: styles.plain,
};

const sizeToClassName = {
    [ButtonSize.small]: styles.small,
    [ButtonSize.medium]: styles.medium,
    [ButtonSize.large]: styles.large,
};

const validateOnlyChildrenOrText = (text: string | null, children: ReactNode | null) => {
    if (isNil(text) && isNil(children)) {
        throw new Error('Buttons must have only `text` or `children`');
    }
};

const Button = ({
    onClick,
    text = '',
    children = null,
    className = '',
    type = ButtonType.primary,
    size = ButtonSize.medium,
    id = generateId(),
    state = ButtonState.enabled,
}: IButtonProps) => {
    validateOnlyChildrenOrText(text, children);

    const typeClassName = classNameToType[type];

    const sizeClassName = sizeToClassName[size];

    const stateClassName = state === ButtonState.disabled
        ? styles.disabled
        : '';

    const buttonClassName = concatClassNames(
        styles.btn,
        typeClassName,
        sizeClassName,
        stateClassName,
        className,
    );

    const content = children ?? text;

    return (
        <button
          type={type === 'submit'
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
    text = '',
    children = null,
    to,
    className = '',
    type = LinkButtonType.primary,
    size = ButtonSize.medium,
    id = generateId(),
    state = ButtonState.enabled,
}: ILinkButtonProps) => {
    validateOnlyChildrenOrText(text, children);
    const isDisabled = state === ButtonState.disabled;

    const typeClassName = classNameToType[type];

    const sizeClassName = sizeToClassName[size];

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

    const content = children ?? text;

    return (
        <Link
          type="button"
          to={to}
          className={buttonClassName}
          id={id}
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
