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

export {
    DEFAULT_PROBLEM_RESULTS_TAKE_CONTESTS_PAGE,
    SubmissionResultType,
    ContestParticipationType,
    ContestResultType,
};
