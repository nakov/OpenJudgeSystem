import { ReactNode } from 'react';

import useTheme from '../../../hooks/use-theme';
import concatClassNames from '../../../utils/class-names';

import styles from './MenuSection.module.scss';

interface IMenuSectionProps {
    children: ReactNode;
    label: string;
}

const MenuSection = ({ children, label }: IMenuSectionProps) => {
    const { isDarkMode, getColorClassName, themeColors } = useTheme();
    return (
        <li
          className={concatClassNames(styles.menuSection, isDarkMode
              ? styles.darkMenuSection
              : '')}
          role="group"
        >
            <span className={styles.menuSectionLabel}>{label}</span>
            <ul>{children}</ul>
        </li>
    );
};

export default MenuSection;
