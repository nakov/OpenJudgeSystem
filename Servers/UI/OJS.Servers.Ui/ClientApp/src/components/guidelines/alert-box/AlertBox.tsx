import React, { useCallback, useMemo, useState } from 'react';

import concatClassNames from '../../../utils/class-names';
import { IHaveOptionalClassName } from '../../common/Props';
import Button, { ButtonType } from '../buttons/Button';

import styles from './AlertBox.module.scss';

enum AlertBoxType {
    error = 1,
    info = 2,
    success = 3
}

const alertBoxTypeToDefaultClassName = {
    [AlertBoxType.error]: styles.error,
    [AlertBoxType.info]: styles.info,
    [AlertBoxType.success]: styles.success,
};

interface IAlertBoxProps extends IHaveOptionalClassName {
    message: string;
    type: AlertBoxType;
    isClosable?: boolean;
    onClose?: () => void;
}

const AlertBox = ({
    message,
    type,
    className,
    isClosable = true,
    onClose,
}: IAlertBoxProps) => {
    const [ isHidden, setIsHidden ] = useState<boolean>(false);

    const internalClassName = useMemo(
        () => {
            const baseClsName = concatClassNames(alertBoxTypeToDefaultClassName[type], styles.alertBox, className);

            return isHidden
                ? concatClassNames(styles.hidden, baseClsName)
                : baseClsName;
        },
        [ className, isHidden, type ],
    );

    const handleOnClickClose = useCallback(
        () => {
            setIsHidden(true);

            if (onClose) {
                onClose();
            }
        },
        [ onClose ],
    );

    const closeButton = useCallback(
        () => {
            if (isClosable) {
                return (
                    <Button
                      type={ButtonType.plain}
                      onClick={handleOnClickClose}
                    >
                        close
                    </Button>
                );
            }

            return null;
        },
        [ handleOnClickClose, isClosable ],
    );

    return (
        <div className={internalClassName}>
            <span>{message}</span>
            {closeButton()}
        </div>
    );
};

export default AlertBox;

export {
    AlertBoxType,
};
