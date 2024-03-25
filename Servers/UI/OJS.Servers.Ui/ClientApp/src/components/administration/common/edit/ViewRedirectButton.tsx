import { FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';

interface IRedirectButtonProps{
    path: string;
    location: string;
}
const ViewRedirectButton = (props: IRedirectButtonProps) => {
    const { path, location } = props;
    return (
        <Tooltip title={`Go to ${location}`}>
            <Link to={path}>
                <IconButton>
                    <FaEye color="blue" />
                </IconButton>
            </Link>
        </Tooltip>
    );
};
export default ViewRedirectButton;
