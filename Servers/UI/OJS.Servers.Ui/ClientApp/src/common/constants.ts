const DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE = 4;

enum SubmissionResultType {
    CorrectAnswer = 'correctanswer',
    WrongAnswer = 'wronganswer',
}

enum ContestParticipationType {
    Compete = 'compete',
    Practice = 'practice',
}

enum ContestResultType {
    Simple = 'simple',
    Full = 'full',
}

enum ContestErrors {
    NotFound,
    Expired,
    NotRegistered,
    NotEligible,
}

const ContestErrorMessages: Record<ContestErrors, string> = {
    [ContestErrors.NotFound]: 'Contest not found!',
    [ContestErrors.Expired]: 'Contest expired!',
    [ContestErrors.NotRegistered]: 'You are not registered for this contest!',
    [ContestErrors.NotEligible]: 'You can not take part in the contest!',
};

export {
    DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE,
    SubmissionResultType,
    ContestParticipationType,
    ContestResultType,
    ContestErrorMessages,
    ContestErrors,
};
