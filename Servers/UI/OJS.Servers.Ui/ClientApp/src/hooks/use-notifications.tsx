import * as React from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Store } from 'react-notifications-component';
import { INotificationType } from '../common/types';
import 'react-notifications-component/dist/theme.css';

import { IHaveChildrenProps } from '../components/common/Props';

interface INotificationsContext {
    notification: INotificationType,
    showNotification: boolean,
    showError(notificationObj: INotificationType): void
    showWarning(notificationObj: INotificationType): void
}

const defaultState = {
    notification: {
        title: '',
        message: 'def',
        type: 'default',
        leaveTimeout: 4000,
    } as INotificationType,
    showNotification: false,
};

interface INotificationsProviderProps extends IHaveChildrenProps {}

const NotificationsContext = createContext<INotificationsContext>(defaultState as INotificationsContext);

const NotificationsProvider = ({ children }: INotificationsProviderProps) => {
    const [ notification, setNotification ] = useState<INotificationType>(defaultState.notification);
    const [ showNotification, setShowNotification ] = useState<boolean>(defaultState.showNotification);

    const showError = useCallback(({ message: m, leaveTimeout = null } : INotificationType) => {
        const n = {
            title: 'Error',
            message: m,
            type: 'danger',
            leaveTimeout:
                leaveTimeout == null
                    ? defaultState.notification.leaveTimeout
                    : leaveTimeout,
        } as INotificationType;
        setNotification(n);
        setShowNotification(true);
    }, [ setNotification ]);

    const showWarning = useCallback(({ message: m, leaveTimeout = null } : INotificationType) => {
        const n = {
            title: 'Warning',
            message: m,
            type: 'warning',
            leaveTimeout:
                leaveTimeout == null
                    ? defaultState.notification.leaveTimeout
                    : leaveTimeout,
        } as INotificationType;
        setNotification(n);
        setShowNotification(true);
    }, [ setNotification ]);

    useEffect(() => {
        if (showNotification) {
            Store.addNotification({
                title: notification.title,
                message: notification.message,
                type: notification.type,
                container: 'bottom-right',
                animationIn: [ 'animate__animated', 'animate__fadeIn' ],
                animationOut: [ 'animate__animated', 'animate__fadeOut' ],
                dismiss: {
                    duration: 5000,
                    onScreen: true,
                },
            });
            setShowNotification(false);
        }
    }, [ notification, showNotification ]);

    const value = { notification, showNotification, showError, showWarning };

    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    );
};

const useNotifications = () => useContext(NotificationsContext);

export {
    useNotifications,
};

export default NotificationsProvider;
