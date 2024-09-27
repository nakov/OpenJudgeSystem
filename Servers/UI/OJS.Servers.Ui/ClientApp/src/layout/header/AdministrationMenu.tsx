import React, { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

import {
    CONTEST_CATEGORIES_PATH,
    CONTESTS_PATH,
    EXAM_GROUPS_PATH,
    NEW_ADMINISTRATION_PATH,
    PARTICIPANTS_PATH,
    PROBLEM_GROUPS_PATH,
    PROBLEMS_PATH,
    ROLES_PATH,
    SUBMISSION_TYPES_PATH,
    SUBMISSIONS_PATH,
    TESTS_PATH,
    USERS_PATH,
} from '../../common/urls/administration-urls';
import Button, { ButtonType } from '../../components/guidelines/buttons/Button';
import useNavigation from '../../hooks/common/use-routing';
import useTheme from '../../hooks/use-theme';
import { useAppSelector } from '../../redux/store';
import concatClassNames from '../../utils/class-names';

import styles from './AdministrationMenu.module.scss';

const AdministrationMenu = () => {
    const [ isMenuVisible, setMenuVisible ] = useState(false);
    const { navigateInNewWindow } = useNavigation();
    const { internalUser: user } = useAppSelector((state) => state.authorization);

    const { themeColors, getColorClassName } = useTheme();

    const handleMouseEnter = () => {
        setMenuVisible(true);
    };

    const handleMouseLeave = () => {
        setMenuVisible(false);
    };

    const onClickNavigate = (administrationEntity: string) => navigateInNewWindow(`/${NEW_ADMINISTRATION_PATH}/${administrationEntity}`);

    return user.canAccessAdministration && (
        <div
          className={styles.adminMenuContainer}
          onMouseOver={handleMouseEnter}
          onMouseOut={handleMouseLeave}
          onFocus={handleMouseEnter}
          onBlur={handleMouseEnter}
        >
            <Button
              onClick={() => navigateInNewWindow(`/${NEW_ADMINISTRATION_PATH}`)}
              type={ButtonType.plain}
              internalClassName={styles.menuButton}
            >
                Administration
                <IoIosArrowDown />
            </Button>

            {/* Transparent spacer to cover the gap */}
            {isMenuVisible && <div className={styles.spacer} />}

            {isMenuVisible && (
                <div
                  className={concatClassNames(
                      styles.dropdownMenu,
                      getColorClassName(themeColors.textColor),
                      getColorClassName(themeColors.baseColor200),
                  )}
                >
                    <div className={styles.menuSection}>
                        <span onClick={() => onClickNavigate(CONTESTS_PATH)}>Contests</span>
                        <span onClick={() => onClickNavigate(EXAM_GROUPS_PATH)}>Exam Groups</span>
                        <span onClick={() => onClickNavigate(SUBMISSIONS_PATH)}>Submissions</span>
                        {user.isAdmin && (
                            <span onClick={() => onClickNavigate(CONTEST_CATEGORIES_PATH)}>Categories</span>)}
                        {user.isAdmin && (
                            <span onClick={() => onClickNavigate(PARTICIPANTS_PATH)}>Participants</span>)}
                    </div>
                    {user.isAdmin && (
                        <>
                            <div className={styles.menuSection}>
                                <span onClick={() => onClickNavigate(PROBLEMS_PATH)}>Problems</span>
                                <span onClick={() => onClickNavigate(PROBLEM_GROUPS_PATH)}>Problem Groups</span>
                                <span onClick={() => onClickNavigate(TESTS_PATH)}>Tests</span>
                                <span onClick={() => onClickNavigate(SUBMISSION_TYPES_PATH)}>Submission Types</span>
                            </div>
                            <div className={styles.menuSection}>
                                <span onClick={() => onClickNavigate(USERS_PATH)}>Users</span>
                                <span onClick={() => onClickNavigate(ROLES_PATH)}>Roles</span>
                                {/* TODO */}
                                {/* <span onClick={() => onClickNavigate(TESTS_PATH)}>
                                Lecturers in contests and categories</span> */}
                            </div>
                            <div className={styles.menuSection}>
                                <span onClick={() => onClickNavigate('')}>All Administrations</span>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdministrationMenu;
