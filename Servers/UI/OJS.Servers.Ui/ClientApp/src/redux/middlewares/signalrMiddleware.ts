import * as signalR from '@microsoft/signalr';
import {
    createListenerMiddleware,
    isAnyOf,
    ListenerEffectAPI,
    TypedStartListening,
} from '@reduxjs/toolkit';

import {
    connectToHub,
    connectionStarted,
    connectionFailed,
    disconnectFromHub,
    updateHubActivity,
    invokeMethod,
    listenToEvent, SignalREvents,
} from '../features/signalrSlice';
import type { AppDispatch, RootState } from '../store';
import {HubConnection} from "@microsoft/signalr";

type AppStartListening = TypedStartListening<RootState, AppDispatch>;

interface ISignalRMiddlewareConfig {
    reconnectPolicy?: number[];
    logLevel?: signalR.LogLevel;
    retryOnFail?: boolean;
    retryDelay?: number;
    retryOnInvokeFail?: boolean;
    inactivityThreshold?: number;
}

type EventName = keyof SignalREvents;

type ListenActionPayload<T extends EventName> = {
    hubName: string;
    eventName: EventName;
    eventHandler: (...args: SignalREvents[EventName]) => any;
}

export const createSignalRMiddleware = (config: ISignalRMiddlewareConfig = {}) => {
    const listenerMiddleware = createListenerMiddleware();

    const startConnection = async (
        api: ListenerEffectAPI<RootState, AppDispatch>,
        hubName: string,
        hubUrl: string,
    ) => {
        const fullHubUrl = `http://localhost:5010/${hubUrl}`;
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(fullHubUrl)
            .withAutomaticReconnect(config.reconnectPolicy || [0, 2000, 10000, 30000])
            .configureLogging(config.logLevel || signalR.LogLevel.Information)
            .build();

        try {
            await connection.start();
            api.dispatch(connectionStarted({ hubName, connection }));
            console.log(`Connected to hub: ${hubName}`);
        } catch (err: any) {
            api.dispatch(connectionFailed({ hubName, error: err.toString() }));
            if (config.retryOnFail) {
                setTimeout(() => startConnection(api, hubName, hubUrl), config.retryDelay || 5000);
            }
        }
    };

    const stopConnection = async (
        api: ListenerEffectAPI<RootState, AppDispatch>,
        hubName: string,
    ) => {
        const state = api.getState() as RootState;
        const connection = state.signalR.connections[hubName]?.connection;
        if (connection) {
            await connection.stop();
            api.dispatch(disconnectFromHub({ hubName }));
            console.log(`Disconnected from hub: ${hubName}`);
        }
    };

    const startAppListening = listenerMiddleware.startListening as AppStartListening;

    startAppListening({
        matcher: isAnyOf(connectToHub, disconnectFromHub, invokeMethod, listenToEvent),
        effect: async (action, listenerApi) => {
            const state = listenerApi.getState() as RootState;
            const signalRState = state.signalR.connections;

            if (connectToHub.match(action)) {
                const { hubName, hubUrl } = action.payload;
                if (!signalRState[hubName] || !signalRState[hubName].isConnected) {
                    await startConnection(listenerApi, hubName, hubUrl);
                } else {
                    console.log(`Connection to ${hubName} already exists`);
                }
            } else if (disconnectFromHub.match(action)) {
                const { hubName } = action.payload;
                if (signalRState[hubName]) {
                    await stopConnection(listenerApi, hubName);
                } else {
                    console.log(`No existing connection to ${hubName}`);
                }
            } else if (invokeMethod.match(action)) {
                const { hubName, method, args } = action.payload;
                const connection = signalRState[hubName]?.connection;
                if (connection && signalRState[hubName]?.isConnected) {
                    try {
                        await connection.invoke(method, ...args);
                        listenerApi.dispatch(updateHubActivity({ hubName, timestamp: Date.now() }));
                    } catch (err: any) {
                        console.error(`Error invoking method ${method} on hub ${hubName}:`, err);
                        if (config.retryOnInvokeFail) {
                            // Implement retry logic here
                        }
                    }
                } else {
                    console.log(`Hub ${hubName} is not connected`);
                }
            } else if (listenToEvent.match(action)) {
                const { hubName, eventName, eventHandler } = action.payload as ListenActionPayload<EventName>;
                const connection = signalRState[hubName]?.connection as HubConnection;
                if (connection !== null && signalRState[hubName]?.isConnected) {
                    connection.on(eventName, (...args: SignalREvents[typeof eventName]) => {
                        try {
                            args.forEach((arg, i) => console.log(`${i}. ${typeof arg}: ${arg}`));
                            console.log(`Received event ${eventName} with args:`, args);
                            eventHandler(...args);
                            // listenerApi.dispatch(eventHandler(...args));
                            // listenerApi.dispatch(updateHubActivity({ hubName, timestamp: Date.now() }));
                        } catch (error) {
                            console.error(`Error in event handler for ${eventName}:`, error);
                            console.error('Event arguments:', args);
                            // if (!(error instanceof TypeError)) {
                            //     console.error(`Error in event handler for ${eventName}:`, error);
                            //     console.error('Event arguments:', args);
                            // }
                        }
                    });
                    console.log(`Listening to event ${eventName} on hub ${hubName}`);
                } else {
                    console.log(`Hub ${hubName} is not connected`);
                }
            }
        },
    });

    return listenerMiddleware.middleware;
};

// Utility function to check and remove inactive connections
export const checkInactiveConnections = (inactivityThreshold: number) => (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const now = Date.now();
    Object.entries(state.signalR.connections).forEach(([hubName, connection]) => {
        if (now - connection.lastActivity > inactivityThreshold) {
            dispatch(disconnectFromHub({ hubName }));
            console.log(`Disconnected inactive hub: ${hubName}`);
        }
    });
};

// Function to reconnect all disconnected hubs
export const reconnectAllHubs = () => (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    Object.entries(state.signalR.connections).forEach(([hubName, connection]) => {
        if (!connection.isConnected) {
            dispatch(connectToHub({ hubName, hubUrl: connection.hubUrl }));
            console.log(`Attempting to reconnect hub: ${hubName}`);
        }
    });
};
