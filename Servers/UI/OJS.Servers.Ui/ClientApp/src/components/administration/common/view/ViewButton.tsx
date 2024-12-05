import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton, Tooltip } from '@mui/material';

interface IViewButtonProps {
    path?: string;
    // eslint-disable-next-line @typescript-eslint/ban-types
    onClick?: Function;
    text: string;
}

const ViewButton = (props: IViewButtonProps) => {
    const { path, text, onClick } = props;

    if (path === undefined && onClick === undefined) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <></>;
    }

    return (
        <Tooltip title={text}>
            {path
                ? (
                    <Link to={path}>
                        <IconButton>
                            <VisibilityIcon color="primary" />
                        </IconButton>
                    </Link>
                )
                : (
                    <IconButton onClick={() => onClick!()}>
                        <VisibilityIcon color="primary" />
                    </IconButton>
                )}
        </Tooltip>
    );
};

export default ViewButton;
