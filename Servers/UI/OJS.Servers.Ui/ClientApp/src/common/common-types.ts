// These are necessary for the app
declare global {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Window { isLoggedIn: boolean; username: string; URLS: URLS }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface URLS {
        UI_URL: string | undefined,
        ADMINISTRATION_URL: string | undefined,
    }
}

interface IDictionary<TValue> {
    [key: string]: TValue;
}

interface INotificationType {
    title: string,
    message: string,
    type?: 'success' | 'danger' | 'info' | 'default' | 'warning',
    leaveTimeout: number | null
}

interface IFileResponseType {
    data: Blob,
    headers: IDictionary<any>,
}

type QuestionTypeType = 'text' | 'single' | 'multiple';

type FilterType = 'all' | 'done' | 'remaining'

export const SulsQuestionTypeMapping : { [key: number]: QuestionTypeType } = {
    1: 'single' as QuestionTypeType,
    2: 'multiple' as QuestionTypeType,
    3: 'text' as QuestionTypeType,
};

export type {
    IDictionary,
    INotificationType,
    IFileResponseType,
    QuestionTypeType,
    FilterType,
};
