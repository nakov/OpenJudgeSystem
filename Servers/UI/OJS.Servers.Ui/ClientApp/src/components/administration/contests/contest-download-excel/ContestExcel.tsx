/* eslint-disable @typescript-eslint/ban-types */
import { useRef, useState } from 'react';
import { SiMicrosoftexcel } from 'react-icons/si';
import { IconButton, Menu, MenuItem } from '@mui/material';

import { ContestParticipationType } from '../../../../common/constants';
import { getEnumMemberName } from '../../../../utils/string-utils';

interface IContestExcelProps {
    onClick: Function;
    contestId: number;
}

const ContestExcel = (props: IContestExcelProps) => {
    const { onClick, contestId } = props;
    const iconButtonRef = useRef(null);
    const [ showExcelMenu, setShowExcelMenu ] = useState<boolean>(false);

    const handleClick = (type: number) => {
        setShowExcelMenu(false);
        onClick(type, contestId);
    };

    return (
        <>
            <IconButton ref={iconButtonRef}>
                <SiMicrosoftexcel onClick={() => setShowExcelMenu(!showExcelMenu)} />

            </IconButton>
            <Menu
              anchorEl={iconButtonRef.current}
              open={showExcelMenu}
              onClose={() => setShowExcelMenu(false)}
            >
                <MenuItem onClick={() => handleClick(0)}>
                    {getEnumMemberName(ContestParticipationType, ContestParticipationType.Compete)}
                </MenuItem>
                <MenuItem onClick={() => handleClick(1)}>
                    {getEnumMemberName(ContestParticipationType, ContestParticipationType.Practice)}
                </MenuItem>
            </Menu>
        </>
    );
};
export default ContestExcel;
