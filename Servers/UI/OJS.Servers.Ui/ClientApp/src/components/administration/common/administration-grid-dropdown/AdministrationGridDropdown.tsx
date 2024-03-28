/* eslint-disable @typescript-eslint/ban-types */
import { useRef, useState } from 'react';
import { CiSquareMore } from 'react-icons/ci';
import { IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from '@mui/material';

interface IAdministrationGridDropdown {
    sections: Array<{icon: any; label: string; handleClick: Function}>;
    id: number | string;
}

const AdministrationGridDropdown = (props: IAdministrationGridDropdown) => {
    const { sections, id } = props;

    const iconButtonRef = useRef(null);
    const [ showMenu, setShowMenu ] = useState<boolean>(false);

    return (
        <>
            <Tooltip title="More">
                <IconButton ref={iconButtonRef} onClick={() => setShowMenu(!showMenu)}>
                    <CiSquareMore />
                </IconButton>
            </Tooltip>
            <Menu
              anchorEl={iconButtonRef.current}
              open={showMenu}
              onClose={() => setShowMenu(false)}
            >
                {sections.map((x) => (
                    <MenuItem key={x.label}>
                        <List disablePadding>
                            <ListItem disablePadding>
                                <ListItemButton
                                  onClick={() => x.handleClick(id)}
                                  sx={{
                                      p: 0,
                                      '&:hover': { backgroundColor: 'transparent' },
                                  }}
                                >
                                    <ListItemIcon>
                                        <div>{x.icon}</div>
                                    </ListItemIcon>
                                    <ListItemText primary={x.label} />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};
export default AdministrationGridDropdown;
