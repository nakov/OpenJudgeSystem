/* eslint-disable @typescript-eslint/ban-types */
import { RiAddBoxFill } from 'react-icons/ri';
import { IconButton, Tooltip } from '@mui/material';

import { CREATE_NEW_PROBLEM } from '../../../../common/labels';

interface ICreateButtonProps {
    showModal: boolean;
    showModalFunc: Function;
    styles: object;
}
const CreateButton = (props: ICreateButtonProps) => {
    const { showModal, showModalFunc, styles } = props;
    return (
        <Tooltip title={CREATE_NEW_PROBLEM}>
            <IconButton
              onClick={() => showModalFunc(!showModal)}
            >
                <RiAddBoxFill style={styles} />
            </IconButton>
        </Tooltip>
    );
};
export default CreateButton;
