interface ISubmissionTypeType {
    id: number,
    name: string,
}

interface ISubmissionResourceType {
    id: number,
    name: string,
    link: string,
    type: number
}

interface IProblemType {
    id: number,
    name: string,
    orderBy: number,
    maximumPoints: number,
    isExcludedFromHomework: boolean,
    memoryLimit: number,
    fileSizeLimit: number,
    timeLimit: number,
    checkerName: string,
    checkerDescription: string,
    resources: ISubmissionResourceType[],
}

interface IContestType {
    id: number,
    name: string,
    categoryId: number,
    categoryName: string,
    startTime: Date,
    endTime: Date,
    practiceStartTime: Date,
    practiceEndTime: Date,
    limitBetweenSubmissions: number,
    isDeleted: boolean,
    isVisible: boolean,
    isOnline: boolean,
    allowedSubmissionTypes: ISubmissionTypeType[],
    problems: IProblemType[],
    canBeCompeted: boolean,
    canBePracticed: boolean,
    resultsArePubliclyVisible: boolean,
    hasContestPassword: boolean,
    hasPracticePassword: boolean,
    remainingTimeInMilliseconds: number,
    userIsAdminOrLecturerInContest: boolean,
    userCanCompete: boolean,
    userIsParticipant: false,
    isActive: boolean,
}

// eslint-disable-next-line import/prefer-default-export
export type { IContestType };
