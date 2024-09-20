import React, { useEffect, useState } from 'react';
import { Button as MuiButton, Fade, Menu, MenuItem } from '@mui/material';

import MenuSection from '../../components/guidelines/menu/MenuSection';
import { useAppSelector } from '../../redux/store';

import styles from './AdministrationHeaderMenu.module.scss';

interface IAdministrationHeaderMenuProps {
    forceClose: boolean;
}

const AdministrationHeaderMenu = ({ forceClose }: IAdministrationHeaderMenuProps) => {
    const { internalUser: user } = useAppSelector((state) => state.authorization);

    const [ anchorEl, setAnchorEl ] = useState<HTMLElement | null>(null);
    const [ isAdminMenuItemOpen, setIsAdminMenuItemOpen ] = useState<boolean>(false);

    const handleClickMenuButton = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseAdminMenu = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        setIsAdminMenuItemOpen(Boolean(anchorEl));
    }, [ anchorEl ]);

    useEffect(() => {
        // Menu is force closed from header when window is resized to small width
        if (forceClose) {
            handleCloseAdminMenu();
        }
    }, [ forceClose ]);

    const renderMenuItems = (menuItems: string[]) => menuItems.map((str) => (<MenuItem onClick={handleCloseAdminMenu}>{str}</MenuItem>));

    return user.canAccessAdministration && (
        <>
            <MuiButton
              className={styles.menuControlButton}
              onClick={handleClickMenuButton}
            >
                ADMINISTRATION
            </MuiButton>
            <Menu
              id="fade-menu"
              className={styles.administrationMenu}
              MenuListProps={{ 'aria-labelledby': 'fade-button' }}
              anchorEl={anchorEl}
              open={isAdminMenuItemOpen}
              onClose={handleCloseAdminMenu}
              TransitionComponent={Fade}
              sx={{ '& .MuiList-root': { padding: 0 } }}
            >
                <MenuSection label="Contests">
                    {renderMenuItems([ 'Contests', 'Categories', 'Participants' ])}
                </MenuSection>
                <MenuSection label="Problems">
                    {renderMenuItems([ 'Problems', 'Problem Groups', 'Tests' ])}
                </MenuSection>
                <MenuSection label="Users">
                    {renderMenuItems([ 'Users', 'Roles', 'Lecturers in contests and categories' ])}
                </MenuSection>
                <MenuItem onClick={handleCloseAdminMenu}>All Administrations</MenuItem>
            </Menu>
        </>
    );
};

export default AdministrationHeaderMenu;
