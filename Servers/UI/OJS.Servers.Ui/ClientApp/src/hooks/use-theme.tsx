import { useDispatch, useSelector } from 'react-redux';

import { ThemeMode } from '../common/enums';
import { toggleTheme } from '../redux/features/themeSlice';

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
const useTheme = () => {
    const dispatch = useDispatch();
    const { mode } = useSelector((state: any) => state.theme);

    const isDarkMode = mode === ThemeMode.Dark;

    const toggleSelectedTheme = () => {
        dispatch(toggleTheme());
    };

    const themeColors: ITheme = {
        // TBD
        light: {
            textColor: 'black',
            baseColor100: '',
            baseColor200: '',
            baseColor300: '',
            baseColor400: '',
            baseColor500: '',
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

    // eslint-disable-next-line prefer-destructuring
    const selectedThemeColors = themeColors[mode];

    return {
        mode,
        toggleSelectedTheme,
        isDarkMode,
        themeColors: selectedThemeColors,
    };
};
export default useTheme;
