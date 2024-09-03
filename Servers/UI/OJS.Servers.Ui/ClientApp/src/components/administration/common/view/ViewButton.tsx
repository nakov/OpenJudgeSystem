import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton, Tooltip } from '@mui/material';

interface IViewButtonProps {
    path: string;
    text: string;
}

const ViewButton = (props: IViewButtonProps) => {
    const { path, text } = props;

    return (
        <Tooltip title={text}>
            <Link to={path}>
                <IconButton>
                    <VisibilityIcon color="primary" />
                </IconButton>
            </Link>
        </Tooltip>
    );
};

export default ViewButton;
