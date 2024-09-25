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

type Anything = Record<string | number, unknown>

export type {
    IDictionary,
    Anything,
};
