import React, { useState } from 'react';
import { Alert as MuiAlert, AlertTitle, Button, Snackbar } from '@mui/material';

interface IAlertProps {
message:string;
severity:AlertSeverity;
onClose? :any;
variant: AlertVariant;
autoHideDuration?:number;
vertical:AlertVerticalOrientation;
horizontal:AlertHorizontalOrientation;
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
    const { message, severity, variant, onClose, autoHideDuration, vertical, horizontal } = props;
    const [ open, setOpen ] = useState<boolean>(true);

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
        setOpen(false);
    };

    return (
        <Snackbar
          open={open}
          onClose={handleClose}
          autoHideDuration={autoHideDuration}
          anchorOrigin={{ vertical, horizontal }}
          onClick={handleClose}
        >
            <MuiAlert
              sx={{ backgroundColor: `${(severity === AlertSeverity.Success)}` && 'rgb(245, 78, 84)' }}
              severity={severity}
              variant={variant}
              onClose={onClose}
              action={
                  (
                      <Button color="inherit" size="small">Close</Button>
                  )
                  }
            >
                <AlertTitle>{message}</AlertTitle>
            </MuiAlert>
        </Snackbar>
    );
};

export {
    Alert,
    AlertSeverity,
    AlertVariant,
    AlertVerticalOrientation,
    AlertHorizontalOrientation,
};
