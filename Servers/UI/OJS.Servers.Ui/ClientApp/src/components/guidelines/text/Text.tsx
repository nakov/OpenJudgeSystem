import React from 'react';

import concatClassNames from '../../../utils/class-names';
import { IHaveOptionalChildrenProps, IHaveOptionalClassName } from '../../common/Props';

import styles from './Text.module.scss';

enum TextType {
    Normal = 0,
    Bold = 1,
    Italic = 2,
    Underlined = 3,
}

interface ITextProps extends IHaveOptionalChildrenProps, IHaveOptionalClassName {
    text?: string;
    type?: TextType;
}

const typeClassNamesMap = {
    [TextType.Normal]: styles.normal,
    [TextType.Bold]: styles.bold,
    [TextType.Italic]: styles.italic,
    [TextType.Underlined]: styles.underlined,
};

const componentMap = {
    [TextType.Normal]: 'span',
    [TextType.Bold]: 'strong',
    [TextType.Italic]: 'em',
    [TextType.Underlined]: 'u',
};

const Text = ({
    text = '',
    children = null,
    type = TextType.Normal,
    className = '',
}: ITextProps) => {
    if (!text && !children) {
        throw new Error('Texts must have only `text` or `children`');
    }

    const content = children ?? text;

    return React.createElement(
        componentMap[type],
        { className: concatClassNames(typeClassNamesMap[type], className) },
        content,
    );
};

export default Text;

export {
    TextType,
};
