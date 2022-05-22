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

interface ILinkButtonProps extends IHaveOptionalClassName, IHaveOptionalChildrenProps {
    text: string;
    id?: string;
    type?: 'primary' | 'secondary' | 'plain' | 'disabled' | 'link';
    size?: 'small' | 'medium' | 'large';
    to: string;
    isToExternal?: boolean,
    onClick?: React.MouseEventHandler<HTMLAnchorElement>,
}

const classNameToType = {
    primary: styles.btn,
    secondary: styles.btnSecondary,
    plain: styles.btnPlain,
    disabled: styles.btnDisabled,
    submit: styles.btn,
    link: styles.link,
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
    onClick,
    className = '',
    type = 'primary',
    size = 'medium',
    id = generateId(),
    isToExternal = false,
    children = null,
}: ILinkButtonProps) => {
    const sizeToClassName = {
        small: styles.small,
        medium: styles.medium,
        large: styles.large,
    };

    const typeClassName = classNameToType[type];

    const sizeClassName = type === 'link'
        ? ''
        : sizeToClassName[size];

    const buttonClassName = concatClassNames(
        className,
        typeClassName,
        sizeClassName,
    );

    const toHref = isToExternal
        ? { pathname: to }
        : to;

    const target = isToExternal
        ? '_blank'
        // eslint-disable-next-line no-undefined
        : undefined;

    return (
        <Link
          to={toHref}
          className={buttonClassName}
          id={id}
          target={target}
          onClick={onClick}
        >
            {text}
            {children}
        </Link>
    );
};

export default Button;

export {
    Button,
    LinkButton,
};
