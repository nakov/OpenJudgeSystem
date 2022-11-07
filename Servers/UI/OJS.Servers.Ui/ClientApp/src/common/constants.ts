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

enum ContestValidationErrors {
    NotFound = 'Contest not found!',
    Expired = 'Contest expired!',
    NotRegistered = 'You are not registered for this contest!',
    NotEligible = 'You can not take part in the contest!',
}

export {
    DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE,
    SubmissionResultType,
    ContestParticipationType,
    ContestResultType,
    ContestValidationErrors,
};
