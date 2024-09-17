// These are necessary for the app
declare global {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Window {
        isLoggedIn: boolean;
        username: string;
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

interface IUrlParam {
    key: string;
    value: string | string[];
}

type Anything = Record<string | number, unknown>

export type {
    IDictionary,
    IKeyValuePair,
    IUrlParam,
    UrlType,
    Anything,
};
