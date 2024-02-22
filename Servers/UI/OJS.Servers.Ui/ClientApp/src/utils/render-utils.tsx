/* eslint-disable import/prefer-default-export */
import { Alert, AlertHorizontalOrientation, AlertSeverity, AlertVariant, AlertVerticalOrientation } from '../components/guidelines/alert/Alert';

const renderAlert = (message: string, severity:AlertSeverity, index:number, autoHideDuration?:number | undefined) => (
    <Alert
      autoHideDuration={autoHideDuration}
      variant={AlertVariant.Filled}
      vertical={AlertVerticalOrientation.Top}
      horizontal={AlertHorizontalOrientation.Right}
      severity={severity}
      message={message}
      styles={{ marginTop: `${index * 4}rem` }}
    />
);

export {
    renderAlert,
};
