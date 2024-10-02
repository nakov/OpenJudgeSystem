import { MdEditNote } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';

import { ThemeMode } from '../../../../common/enums';
import { getColors, useAdministrationTheme } from '../../../../hooks/use-administration-theme-provider';

interface IRedirectButtonProps{
    path: string;
    location: string;
}
const RedirectButton = (props: IRedirectButtonProps) => {
    const { path, location } = props;
    const { themeMode } = useAdministrationTheme();
    return (
        <Tooltip title={`Go to ${location}`}>
            <Link to={path}>
                <IconButton>
                    <MdEditNote color={themeMode === ThemeMode.Dark
                        ? getColors(themeMode).palette.primary.main
                        : 'blue'}
                    />
                </IconButton>
            </Link>
        </Tooltip>
    );
};
export default RedirectButton;
