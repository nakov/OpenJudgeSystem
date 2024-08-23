interface IContestResultsType {
    id: number;
    categoryId: number;
    name: string;
    userIsInRoleForContest: boolean;
    problems: IContestResultsProblemType[];
    results: IContestResultsParticipationType[];
    pagesCount: number;
    itemsPerPage: number;
}

interface IContestResultsProblemType {
    id: number;
    problemGroupId: number;
    name: string;
    maximumPoints: boolean;
}

interface IContestResultsParticipationType {
    participantUsername: string;
    participantFirstName: string;
    participantLastName: string;
    total: number;
    adminTotal: number;
    problemResults: IContestResultsParticipationProblemType[];
}

interface IContestResultsParticipationProblemType {
    problemId: number;
    maximumPoints: boolean;
    bestSubmission: IContestResultsParticipationProblemBestSubmissionType;
}

interface IContestResultsParticipationProblemBestSubmissionType {
    id: number;
    points: number;
    isCompiledSuccessfully: boolean;
    submissionType: string;
    testRuns: IContestResultsParticipationProblemBestSubmissionTestRunType[];
}

interface IContestResultsParticipationProblemBestSubmissionTestRunType {
    isZeroTest: boolean;
    resultType: string;
}

export type {
    IContestResultsType,
    IContestResultsProblemType,
    IContestResultsParticipationType,
    IContestResultsParticipationProblemType,
    IContestResultsParticipationProblemBestSubmissionType,
    IContestResultsParticipationProblemBestSubmissionTestRunType,
};
