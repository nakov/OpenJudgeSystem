import { useDispatch, useSelector } from 'react-redux';

import { toggleTheme } from '../redux/features/themeSlice';

import styles from '../styles/theme-styles.module.scss';

interface ITheme {
    [key: string]: {
        textColor: string;
        baseColor100: string;
        baseColor200: string;
        baseColor300: string;
        baseColor400: string;
        baseColor500: string;
    };
}

interface IThemeClassName {
    [key: string]: string;
}

const useTheme = () => {
    const dispatch = useDispatch();
    const { mode } = useSelector((state: any) => state.theme);

    const toggleSelectedTheme = () => {
        dispatch(toggleTheme());
    };

    const themeColors: ITheme = {
        // TBD
        light: {
            textColor: 'black',
            baseColor100: '#fdfdfd',
            baseColor200: '#d7d7d7',
            baseColor300: '#adadad',
            baseColor400: '#9a9a9a',
            baseColor500: '#6c6c6c',
        },
        dark: {
            textColor: 'white',
            baseColor100: '#687487',
            baseColor200: '#374151',
            baseColor300: '#2C2F37',
            baseColor400: '#212328',
            baseColor500: '#2F2F2F',
        },
    };

    const colorClassName: IThemeClassName = {
        [themeColors.light.textColor]: styles.blackColorClassName,
        [themeColors.dark.textColor]: styles.whiteColorClassName,
        // dark color class names
        [themeColors.dark.baseColor100]: styles.darkBaseColor100ClassName,
        [themeColors.dark.baseColor200]: styles.darkBaseColor200ClassName,
        [themeColors.dark.baseColor300]: styles.darkBaseColor300ClassName,
        [themeColors.dark.baseColor400]: styles.darkBaseColor400ClassName,
        [themeColors.dark.baseColor500]: styles.darkBaseColor500ClassName,
        // light color class names TBD
        [themeColors.light.baseColor100]: styles.lightBaseColor100ClassName,
        [themeColors.light.baseColor200]: styles.lightBaseColor200ClassName,
        [themeColors.light.baseColor300]: styles.lightBaseColor300ClassName,
        [themeColors.light.baseColor400]: styles.lightBaseColor400ClassName,
        [themeColors.light.baseColor500]: styles.lightBaseColor500ClassName,
    };

    // eslint-disable-next-line prefer-destructuring
    const selectedThemeColors = themeColors[mode];

    const getColorClassName = (color: string) => colorClassName[color];

    return { mode, toggleSelectedTheme, themeColors: selectedThemeColors, getColorClassName };
};
export default useTheme;
