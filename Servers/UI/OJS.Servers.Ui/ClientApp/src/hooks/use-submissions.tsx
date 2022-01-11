import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import IHaveChildrenProps from '../components/common/IHaveChildrenProps';
import { useLoading } from './use-loading';
import { useHttp } from './use-http';
import { getSubmissionUrl, getSubmissionsForProfileUrl } from '../utils/urls';

interface IProblemType {
    id: number,
    name: string,
    maximumPoints: number,
}

interface ITestRunType {
    id: number,
    maxUsedTime: number,
    maxUsedMemory: number,
    executionComment: string,
    checkerComment: string,
    resultType: string,
    expectedOutputFragment: string,
    userOutputFragment: string,
}

interface ISubmissionType {
    id: number,
    submittedOn: Date,
    problem: IProblemType,
    submissionTypeName: string,
    points: number,
    testRuns: ITestRunType[]
    maxUsedTime: number,
    maxUsedMemory: number
}

interface ISubmissionsContext {
    currentSubmission: ISubmissionType | undefined,
    submissions: ISubmissionType[]
    getSubmission: (submissionId: number) => Promise<void>,
    getUserSubmissions: () => Promise<void>
    setCurrentSubmissionId: (submissionId: number) => void;
}

const defaultState = { };

const SubmissionsContext = createContext<ISubmissionsContext>(defaultState as ISubmissionsContext);

interface ISubmissionsProviderProps extends IHaveChildrenProps {}

const SubmissionsProvider = ({ children }: ISubmissionsProviderProps) => {
    const { startLoading, stopLoading } = useLoading();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ submissions, setSubmissions ] = useState<ISubmissionType[]>([]);
    const [ currentSubmissionId, setCurrentSubmissionId ] = useState<number>();
    const [ currentSubmission, setCurrentSubmission ] = useState<ISubmissionType>();
    const getCurrentSubmissionUrl = useMemo(() => `${getSubmissionUrl}/${currentSubmissionId}`, [
        currentSubmissionId,
    ]);

    const {
        get: getSubmissionsForProfileRequest,
        data: getSubmissionsForProfileData,
    } = useHttp(getSubmissionsForProfileUrl);

    const {
        get: getSubmissionRequest,
        data: getSubmissionData,
    } = useHttp(getCurrentSubmissionUrl);

    const getUserSubmissions = useCallback(async () => {
        startLoading();
        await getSubmissionsForProfileRequest();
        stopLoading();
    }, [ getSubmissionsForProfileRequest, startLoading, stopLoading ]);

    const getSubmission = useCallback(async () => {
        if (currentSubmissionId != null) {
            startLoading();
            await getSubmissionRequest();
            stopLoading();
        }
    }, [ currentSubmissionId, getSubmissionRequest, startLoading, stopLoading ]);

    useEffect(() => {
        if (getSubmissionsForProfileData != null) {
            setSubmissions(getSubmissionsForProfileData as ISubmissionType[]);
        }
    }, [ getSubmissionsForProfileData ]);

    useEffect(() => {
        if (getSubmissionData != null) {
            setCurrentSubmission(getSubmissionData as ISubmissionType);
        }
    }, [ getSubmissionData ]);

    useEffect(() => {
        console.log(currentSubmission);
    });

    const value = {
        currentSubmission,
        setCurrentSubmissionId,
        submissions,
        getUserSubmissions,
        getSubmission,
    };

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

export type { ISubmissionType, ITestRunType };

export default SubmissionsProvider;
