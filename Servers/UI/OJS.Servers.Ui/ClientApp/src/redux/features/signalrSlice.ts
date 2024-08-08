import {ActionCreatorWithPayload, createSlice, PayloadAction} from '@reduxjs/toolkit';
import * as signalR from '@microsoft/signalr';
import {IPublicSubmission} from "../../common/types";

interface IConnectionState {
    connection: signalR.HubConnection | null;
    isConnected: boolean;
    error: string | null;
    lastActivity: number;
    hubUrl: string;
}

interface ISignalRState {
    connections: Record<string, IConnectionState>;
}

export type SignalREvents = {
    ReceivePointsUpdate: [IPublicSubmission];
}

const initialState: ISignalRState = { connections: {} };

export const signalrSlice = createSlice({
    name: 'signalR',
    initialState,
    reducers: {
        connectToHub: (state, action: PayloadAction<{ hubName: string; hubUrl: string }>) => {
            const { hubName, hubUrl } = action.payload;
            state.connections[hubName] = {
                connection: null,
                isConnected: false,
                error: null,
                lastActivity: Date.now(),
                hubUrl,
            };
        },
        connectionStarted: (state, action: PayloadAction<{ hubName: string; connection: signalR.HubConnection }>) => {
            const { hubName, connection } = action.payload;
            if (state.connections[hubName]) {
                state.connections[hubName].connection = connection;
                state.connections[hubName].isConnected = true;
                state.connections[hubName].error = null;
                state.connections[hubName].lastActivity = Date.now();
            }
        },
        connectionFailed: (state, action: PayloadAction<{ hubName: string; error: string }>) => {
            const { hubName, error } = action.payload;
            if (state.connections[hubName]) {
                state.connections[hubName].isConnected = false;
                state.connections[hubName].error = error;
            }
        },
        disconnectFromHub: (state, action: PayloadAction<{ hubName: string }>) => {
            const { hubName } = action.payload;
            delete state.connections[hubName];
        },
        updateHubActivity: (state, action: PayloadAction<{ hubName: string; timestamp: number }>) => {
            const { hubName, timestamp } = action.payload;
            if (state.connections[hubName]) {
                state.connections[hubName].lastActivity = timestamp;
            }
        },
        invokeMethod: (state, action: PayloadAction<{ hubName: string; method: string; args: any[] }>) => {
            // This is handled by the middleware, so we don't need to update state here
            return state;
        },
        listenToEvent: (state, action: PayloadAction<{ hubName: string; eventName: string; eventHandler: (...args: SignalREvents[keyof SignalREvents]) => any;}>) => {
            // This is handled by the middleware, so we don't need to update state here
            return state;
        },
    },
});

export const {
    connectToHub,
    connectionStarted,
    connectionFailed,
    disconnectFromHub,
    updateHubActivity,
    invokeMethod,
    listenToEvent,
} = signalrSlice.actions as {
    connectToHub: ActionCreatorWithPayload<{
        hubName: string;
        hubUrl: string;
    }, string>;
    connectionStarted: ActionCreatorWithPayload<{
        hubName: string;
        connection: signalR.HubConnection;
    }, string>;
    connectionFailed: ActionCreatorWithPayload<{
        hubName: string;
        error: string;
    }, string>;
    disconnectFromHub: ActionCreatorWithPayload<{
        hubName: string;
    }, string>;
    updateHubActivity: ActionCreatorWithPayload<{
        hubName: string;
        timestamp: number;
    }, string>;
    invokeMethod: ActionCreatorWithPayload<{
        hubName: string;
        method: string;
        args: any[];
    }, string>;
    listenToEvent: ActionCreatorWithPayload<{
        hubName: string;
        eventName: string;
        eventHandler: (...args: SignalREvents[keyof SignalREvents]) => any;
    }, string>;
};

export default signalrSlice.reducer;




























// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import * as signalR from '@microsoft/signalr';
//
// // interface IConnectionState {
// //     connection: signalR.HubConnection | null;
// //     isConnected: boolean;
// //     error: string | null;
// //     lastActivity: number;
// //     hubUrl: string;
// // }
//
// interface IConnectionState {
//     isConnected: boolean;
//     error: string | null;
//     lastActivity: number;
//     hubUrl: string;
// }
//
// interface ISignalRState {
//     connections: Record<string, IConnectionState>;
// }
//
// const initialState: ISignalRState = { connections: {} };
//
// export const signalrSlice = createSlice({
//     name: 'signalR',
//     initialState,
//     reducers: {
//         connectToHub: (state, action: PayloadAction<{ hubName: string; hubUrl: string }>) => {
//             const { hubName, hubUrl } = action.payload;
//             state.connections[hubName] = {
//                 // connection: null,
//                 isConnected: false,
//                 error: null,
//                 lastActivity: Date.now(),
//                 hubUrl,
//             };
//             console.log(`CONNECTING - ${JSON.stringify(state.connections[hubName])}`)
//         },
//         // connectionStarted: (state, action: PayloadAction<{ hubName: string; connection: signalR.HubConnection }>) => {
//         //     const { hubName, connection } = action.payload;
//         //     if (state.connections[hubName]) {
//         //         state.connections[hubName].connection = connection;
//         //         state.connections[hubName].isConnected = true;
//         //         state.connections[hubName].error = null;
//         //         state.connections[hubName].lastActivity = Date.now();
//         //     }
//         //     console.log(`STARTED - ${JSON.stringify(state.connections[hubName])}`);
//         // },
//         connectionStarted: (state, action: PayloadAction<{ hubName: string }>) => {
//             const { hubName } = action.payload;
//             if (state.connections[hubName]) {
//                 state.connections[hubName].isConnected = true;
//                 state.connections[hubName].error = null;
//                 state.connections[hubName].lastActivity = Date.now();
//             }
//         },
//         connectionFailed: (state, action: PayloadAction<{ hubName: string; error: string }>) => {
//             const { hubName, error } = action.payload;
//             if (state.connections[hubName]) {
//                 state.connections[hubName].isConnected = false;
//                 state.connections[hubName].error = error;
//             }
//         },
//         disconnectFromHub: (state, action: PayloadAction<{ hubName: string }>) => {
//             const { hubName } = action.payload;
//             delete state.connections[hubName];
//         },
//         updateHubActivity: (state, action: PayloadAction<{ hubName: string; timestamp: number }>) => {
//             const { hubName, timestamp } = action.payload;
//             if (state.connections[hubName]) {
//                 state.connections[hubName].lastActivity = timestamp;
//             }
//         },
//         invokeMethod: (state, action: PayloadAction<{ hubName: string; method: string; args: any[] }>) => {
//             // This is handled by the middleware, so we don't need to update state here
//         },
//         listenToEvent: (state, action: PayloadAction<{ hubName: string; eventName: string; eventHandler: (...args: any[]) => any }>) => {
//             // This is handled by the middleware, so we don't need to update state here
//         },
//     },
// });
//
// export const {
//     connectToHub,
//     connectionStarted,
//     connectionFailed,
//     disconnectFromHub,
//     updateHubActivity,
//     invokeMethod,
//     listenToEvent,
// } = signalrSlice.actions;
//
// export default signalrSlice.reducer;