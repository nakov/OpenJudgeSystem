declare global {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Window { isLoggedIn: boolean; username: string; }
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
    QuestionTypeType,
    FilterType,
};
