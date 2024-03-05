/* eslint-disable @typescript-eslint/ban-types */
import { RiAddBoxFill } from 'react-icons/ri';
import { IconButton, Tooltip } from '@mui/material';

import { CREATE_NEW_RECORD } from '../../../../common/labels';
import { IconType } from 'react-icons/lib/cjs/iconBase';

interface ICreateButtonProps {
    showModal: boolean;
    showModalFunc: Function;
    styles: object;
    Icon? : IconType;
    tooltipLabel?: string;
}
const CreateButton = (props: ICreateButtonProps) => {
    const { showModal, showModalFunc, styles, Icon, tooltipLabel = CREATE_NEW_RECORD } = props;
    return (
        <Tooltip title={tooltipLabel}>
            <IconButton
              onClick={() => showModalFunc(!showModal)}
            >

                {Icon
                    ? <Icon style={styles} />
                    : <RiAddBoxFill style={styles} />}
            </IconButton>
        </Tooltip>
    );
};
export default CreateButton;
