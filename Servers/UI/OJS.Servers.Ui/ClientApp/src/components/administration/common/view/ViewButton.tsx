import { Link } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton } from '@mui/material';
import StyledTooltip from 'src/components/administration/common/styled-tooltip/StyledTooltip';

interface IViewButtonProps {
    path: string;
    text: string;
}

const ViewButton = (props: IViewButtonProps) => {
    const { path, text } = props;

    return (
        <StyledTooltip
          placement="left"
          arrow
          title={text}
        >
            <Link to={path}>
                <IconButton>
                    <VisibilityIcon color="primary" />
                </IconButton>
            </Link>
        </StyledTooltip>
    );
};

export default ViewButton;
