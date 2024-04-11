/* eslint-disable @typescript-eslint/ban-types */
import { IconType } from 'react-icons/lib/cjs/iconBase';
import { RiAddBoxFill } from 'react-icons/ri';
import { IconButton, Tooltip } from '@mui/material';

import { CREATE_NEW_RECORD } from '../../../../common/labels';
import { ACTION_NOT_ALLOWED_MESSAGE } from '../../../../common/messages';

interface ICreateButtonProps {
    showModal: boolean;
    showModalFunc: Function;
    styles: object;
    Icon? : IconType;
    tooltipLabel?: string;
    disabled? :boolean;
    disabledMessage?: string;
}
const CreateButton = (props: ICreateButtonProps) => {
    const {
        showModal,
        showModalFunc,
        styles,
        Icon,
        tooltipLabel = CREATE_NEW_RECORD,
        disabled = false,
        disabledMessage = ACTION_NOT_ALLOWED_MESSAGE,
    } = props;
    return (
        <Tooltip title={disabled
            ? disabledMessage
            : tooltipLabel}
        >
            <span>
                <IconButton
                  disabled={disabled}
                  onClick={() => showModalFunc(!showModal)}
                >

                    {Icon
                        ? <Icon style={styles} />
                        : (
                            <RiAddBoxFill
                              style={styles}
                            />
                        )}
                </IconButton>
            </span>
        </Tooltip>
    );
};
export default CreateButton;
