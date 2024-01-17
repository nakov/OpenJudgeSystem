import React, { useState } from 'react';
import { Alert as MuiAlert, Button, Portal, Snackbar } from '@mui/material';

import './Alert.module.scss';

interface IAlertProps {
    message:string;
    severity:AlertSeverity;
    onClose? :any;
    variant: AlertVariant;
    autoHideDuration?:number;
    vertical:AlertVerticalOrientation;
    horizontal:AlertHorizontalOrientation;
    styles?: React.CSSProperties;
}

 enum AlertVariant{
    Outlined ='outlined',
    Filled = 'filled',
    Standard = 'standard',
}
 enum AlertSeverity {
    Error = 'error',
    Info = 'info',
    Warning = 'warning',
    Success = 'success',
}

enum AlertVerticalOrientation {
    Top = 'top',
    Bottom = 'bottom',
}

enum AlertHorizontalOrientation {
    Left = 'left',
    Right = 'right',
    Center = 'center',
}
const Alert = (props:IAlertProps) => {
    const { message, severity, variant, onClose, autoHideDuration, vertical, horizontal, styles } = props;
    const [ open, setOpen ] = useState<boolean>(true);

    const alertClass = `${severity === AlertSeverity.Success}`
        ? 'success-alert'
        : '';
    const handleClose = () => {
        if (onClose) {
            onClose();
        }
        setOpen(false);
    };

    return (
        <Portal>
            <Snackbar
              open={open}
              onClose={handleClose}
              autoHideDuration={autoHideDuration}
              anchorOrigin={{ vertical, horizontal }}
              onClick={handleClose}
            >
                <MuiAlert
                  className={`${alertClass}`}
                  severity={severity}
                  variant={variant}
                  onClose={onClose}
                  sx={{ display: 'flex', alignItems: 'center' }}
                  style={styles || {}}
                >
                    {message}
                    <Button className="alert-button" color="inherit" size="small">Close</Button>
                </MuiAlert>
            </Snackbar>
        </Portal>
    );
};

export {
    Alert,
    AlertSeverity,
    AlertVariant,
    AlertVerticalOrientation,
    AlertHorizontalOrientation,
};
