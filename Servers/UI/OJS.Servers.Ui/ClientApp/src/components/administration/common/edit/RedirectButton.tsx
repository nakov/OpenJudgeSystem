import { IoNavigateOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';

interface IRedirectButtonProps{
    path: string;
    location: string;
}
const RedirectButton = (props: IRedirectButtonProps) => {
    const { path, location } = props;
    return (
        <Tooltip title={`Go to ${location}`}>
            <Link to={path}>
                <IconButton>
                    <IoNavigateOutline color="blue" />
                </IconButton>
            </Link>
        </Tooltip>
    );
};
export default RedirectButton;
