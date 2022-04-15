import * as React from 'react';
import { Link } from 'react-router-dom';
import concatClassNames from '../../../utils/class-names';
import { IHaveOptionalChildrenProps, IHaveOptionalClassName } from '../../common/Props';
import generateId from '../../../utils/id-generator';

import styles from './Button.module.scss';

interface IButtonProps extends IHaveOptionalChildrenProps, IHaveOptionalClassName {
    text?: string,
    id?: string,
    onClick: React.MouseEventHandler<HTMLButtonElement>,
    type?: 'primary' | 'secondary' | 'plain' | 'disabled' | 'submit',
    size?: 'small' | 'medium' | 'large',
}

interface ILinkButtonProps extends IHaveOptionalClassName {
    text: string;
    id?: string;
    type?: 'primary' | 'secondary' | 'plain' | 'disabled';
    size?: 'small' | 'medium' | 'large';
    to: string;
}

const classNameToType = {
    primary: styles.btn,
    secondary: styles.btnSecondary,
    plain: styles.btnPlain,
    disabled: styles.btnDisabled,
    submit: styles.btn,
};

const Button = ({
    onClick,
    text = '',
    children = null,
    className = '',
    type = 'primary',
    size = 'medium',
    id = generateId(),
}: IButtonProps) => {
    if (!text && !children) {
        throw new Error('Buttons must have only `text` or `children`');
    }
    const sizeToClassName = {
        small: styles.btnSmall,
        medium: styles.btnMedium,
        large: styles.btnLarge,
    };

    const typeClassName = classNameToType[type];

    const sizeClassName = sizeToClassName[size];

    const buttonClassName = concatClassNames(
        typeClassName,
        sizeClassName,
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
    text,
    to,
    className = '',
    type = 'primary',
    size = 'medium',
    id = generateId(),
}: ILinkButtonProps) => {
    const sizeToClassName = {
        small: styles.small,
        medium: styles.medium,
        large: styles.large,
    };

    const typeClassName = classNameToType[type];

    const sizeClassName = sizeToClassName[size];

    const buttonClassName = concatClassNames(
        className,
        typeClassName,
        sizeClassName,
    );

    return (
        <Link
          type="button"
          to={to}
          className={buttonClassName}
          id={id}
        >
            {text}
        </Link>
    );
};

export default Button;

export {
    Button,
    LinkButton,
};
