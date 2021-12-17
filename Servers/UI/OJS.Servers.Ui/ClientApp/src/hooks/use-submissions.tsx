import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import IHaveChildrenProps from '../components/common/IHaveChildrenProps';
import { useLoading } from './use-loading';
import { useHttp } from './use-http';
import { getSubmissionsForProfileUrl } from '../utils/urls';

interface IProblemType {
    id: number,
    name: string,
    maximumPoints: number,
}

interface ITestRunType {
    id: number,
    timeUsed: number,
    memoryUsed: number,
    executionComment: string,
    checkerComment: string,
}

interface ISubmissionType {
    id: number,
    submittedOn: Date,
    problem: IProblemType,
    submissionTypeName: string,
    points: number,
    testRuns: ITestRunType[]
}

interface ISubmissionsContext {
    submissions: ISubmissionType[]
    getUserSubmissions: () => Promise<void>
}

const defaultState = {};

const SubmissionsContext = createContext<ISubmissionsContext>(defaultState as ISubmissionsContext);

interface ISubmissionsProviderProps extends IHaveChildrenProps {}

const SubmissionsProvider = ({ children }: ISubmissionsProviderProps) => {
    const { startLoading, stopLoading } = useLoading();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ submissions, setSubmissions ] = useState<ISubmissionType[]>([]);
    const {
        get: getSubmissionsForProfileRequest,
        data: getSubmissionsForProfileData,
    } = useHttp(getSubmissionsForProfileUrl);

    const getUserSubmissions = useCallback(async () => {
        startLoading();
        await getSubmissionsForProfileRequest();
        stopLoading();
    }, [ getSubmissionsForProfileRequest, startLoading, stopLoading ]);

    useEffect(() => {
        if (getSubmissionsForProfileData != null) {
            console.log(getSubmissionsForProfileData);
            setSubmissions(getSubmissionsForProfileData as ISubmissionType[]);
        }
    }, [ getSubmissionsForProfileData ]);

    const value = { submissions, getUserSubmissions };

    return (
        <SubmissionsContext.Provider value={value}>
            {children}
        </SubmissionsContext.Provider>
    );
};

const useSubmissions = () => useContext(SubmissionsContext);

export {
    useSubmissions,
};

export type { ISubmissionType };

export default SubmissionsProvider;
