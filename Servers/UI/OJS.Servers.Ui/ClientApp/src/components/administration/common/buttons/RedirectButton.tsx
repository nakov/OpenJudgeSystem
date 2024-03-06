import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';

interface IRedirectProps {
    // Url
    path: string;
    // Page name
    location?: string;
    tooltipText?: string;
}

interface IRedirectButtonProps extends IRedirectProps {
    icon: ReactNode;
}
const RedirectButton = ({
    path,
    location,
    icon,
    tooltipText,
}: IRedirectButtonProps) => (
    <Tooltip title={!tooltipText
        ? `Go to ${location}`
        : tooltipText}
    >
        <Link to={path}>
            <IconButton>
                { icon }
            </IconButton>
        </Link>
    </Tooltip>
);

export type { IRedirectProps, IRedirectButtonProps };
export default RedirectButton;
