import { ISubmissionTypeType } from '../../common/types';
import { IUserProfileType } from '../use-users';

interface IProblemType {
    id: number;
    name: string;
    maximumPoints: number;
}

interface ITestRunType {
    id: number;
    timeUsed: number;
    memoryUsed: number;
    executionComment: string;
    checkerComment: string;
    resultType: string;
    expectedOutputFragment: string;
    userOutputFragment: string;
    orderBy: number;
}

interface ISubmissionType {
    id: number;
    submittedOn: Date;
    content: string;
    problem: IProblemType;
    submissionTypeName: string;
    submissionType: ISubmissionTypeType;
    points: number;
    testRuns: ITestRunType[];
    maxUsedTime: number;
    maxUsedMemory: number;
    isOfficial: boolean;
    isCompiledSuccessfully: boolean;
    compilerComment: string;
    createdOn: Date;
    modifiedOn?: Date;
}

interface ITestRunDetailsType extends ITestRunType {
    isTrialTest: boolean;
}

interface ISubmissionDetailsType extends ISubmissionType {
    testRuns: ITestRunDetailsType[];
    user: IUserProfileType;
}

interface ISubmissionDetails {
    id: number;
    problemId: number;
    createdOn: Date;
    content: string;
    points: number;
    maximumPoints: number;
    isProcessed: boolean;
    isCompiledSuccessfully: boolean;
    isOfficial: boolean;
    submissionType: string;
    compilerComment: string;
    testRuns: ITestRunDetailsType[];
}

export type {
    IProblemType,
    ITestRunType,
    ISubmissionType,
    ITestRunDetailsType,
    ISubmissionDetailsType,
    ISubmissionDetails,
};
