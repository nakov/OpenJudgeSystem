// These are necessary for the app
declare global {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Window {
        isLoggedIn: boolean;
        username: string;
        URLS: URLS;
        Keys: Keys;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface URLS {
        UI_URL: string | undefined;
        ADMINISTRATION_URL: string | undefined;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Keys {
        YOUTUBE_VIDEO_ID: string;
    }
}

interface IDictionary<TValue> {
    [key: string]: TValue;
}

interface IKeyValuePair<TValue> {
    key: string;
    value: TValue;
}

type UrlType<T> = string | ((parameters?: IDictionary<T> | null) => string);

interface INotificationType {
    title: string;
    message: string;
    type?: 'success' | 'danger' | 'info' | 'default' | 'warning';
    leaveTimeout: number | null;
}

/* eslint-enable @typescript-eslint/no-explicit-any */

interface IUrlParam {
    key: string;
    value: string | string[];
}

type Anything = Record<string | number, unknown>

export type {
    IDictionary,
    IKeyValuePair,
    INotificationType,
    IUrlParam,
    UrlType,
    Anything,
};
