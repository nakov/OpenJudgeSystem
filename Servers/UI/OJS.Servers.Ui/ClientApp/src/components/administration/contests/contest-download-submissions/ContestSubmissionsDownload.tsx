import { useRef, useState } from 'react';
import { FaCloudDownloadAlt } from 'react-icons/fa';
import { IconButton, Menu, MenuItem } from '@mui/material';

import { ContestParticipationType } from '../../../../common/constants';
import { getEnumMemberName } from '../../../../utils/string-utils';

interface IContestSubmissionsDownloadProps {
    // eslint-disable-next-line @typescript-eslint/ban-types
    onClick: Function;
    contestId: number;
}

const ContestSubmissionsDownload = (props: IContestSubmissionsDownloadProps) => {
    const { onClick, contestId } = props;
    const iconButtonRef = useRef(null);
    const [ showExcelMenu, setShowExcelMenu ] = useState<boolean>(false);
    const [ subMenuAnchorEl, setSubMenuAnchorEl ] = useState(null);
    const handleClick = (type: number) => {
        setShowExcelMenu(false);
        onClick(type, contestId);
    };

    const handleSubMenuOpen = (event: any) => {
        setSubMenuAnchorEl(event.currentTarget);
        console
    };

    const renderInnerMenu = () => {
        <Menu
          id="sub-menu"
          anchorEl={subMenuAnchorEl}
          keepMounted
          open={Boolean(subMenuAnchorEl)}
        //   onClose={handleSubMenuClose}
          anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
          }}
          transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
          }}
        >
            <MenuItem onClick={() => handleClick(0)}>Sub Option 1</MenuItem>
            <MenuItem onClick={() => handleClick(1)}>Sub Option 2</MenuItem>
        </Menu>;
    };
    return (
        <>
            <IconButton ref={iconButtonRef}>
                <FaCloudDownloadAlt onClick={() => setShowExcelMenu(!showExcelMenu)} />

            </IconButton>
            <Menu
              anchorEl={iconButtonRef.current}
              open={showExcelMenu}
              onClose={() => setShowExcelMenu(false)}
            >
                <MenuItem onMouseOver={handleSubMenuOpen}>
                    {getEnumMemberName(ContestParticipationType, ContestParticipationType.Compete)}
                </MenuItem>
                <MenuItem onMouseOver={handleSubMenuOpen}>
                    {getEnumMemberName(ContestParticipationType, ContestParticipationType.Practice)}
                </MenuItem>
            </Menu>
            {renderInnerMenu()}

        </>
    );
};

export default ContestSubmissionsDownload;
