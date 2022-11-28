import React, { useCallback, useMemo, useState } from 'react';

import concatClassNames from '../../../utils/class-names';
import { IHaveOptionalClassName } from '../../common/Props';
import Button, { ButtonType } from '../buttons/Button';

import styles from './AlertBox.module.scss';

enum AlertBoxType {
    error = 1,
    info = 2
}

const alertBoxTypeToDefaulClassName = {
    [AlertBoxType.error]: styles.error,
    [AlertBoxType.info]: 'info',
};

interface IAlertBoxProps extends IHaveOptionalClassName {
    message: string;
    type: AlertBoxType;
    onClose: () => void;
}

const AlertBox = ({
    message,
    type,
    className,
    onClose,
}: IAlertBoxProps) => {
    const [ isHidden, setIsHidden ] = useState<boolean>(false);

    const internalClassName = useMemo(() => {
        const baseClsName = concatClassNames(alertBoxTypeToDefaulClassName[type], styles.alertBox, className);

        return isHidden
            ? concatClassNames(styles.hidden, baseClsName)
            : baseClsName;
    }, [ className, isHidden, type ]);

    const handleOnClickClose = useCallback(() => {
        setIsHidden(true);
        onClose();
    }, [ onClose ]);

    return (
        <div className={internalClassName}>
            <span>{message}</span>
            <Button
              type={ButtonType.plain}
              onClick={handleOnClickClose}
            >
                close
            </Button>
        </div>
    );
};

export default AlertBox;

export {
    AlertBoxType,
};
