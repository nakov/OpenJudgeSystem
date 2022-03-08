import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import IHaveChildrenProps from '../../components/common/IHaveChildrenProps';
import { useLoading } from '../use-loading';
import { useHttp } from '../use-http';
import { ITestRunType, ISubmissionType } from './types';
import { getSubmissionsForProfileUrl, submitUrl } from '../../utils/urls';
import { useContests } from '../contests/use-contests';

interface ISubmissionsContext {
    submissions: ISubmissionType[]
    currentSubmissionCode: string,
    getUserSubmissions: () => Promise<void>
    submit: () => Promise<void>
    setCode: (code: string) => void;
}

const defaultState = { currentSubmissionCode: 'Write your code here' };

const SubmissionsContext = createContext<ISubmissionsContext>(defaultState as ISubmissionsContext);

interface ISubmissionsProviderProps extends IHaveChildrenProps {}

const SubmissionsProvider = ({ children }: ISubmissionsProviderProps) => {
    const { startLoading, stopLoading } = useLoading();
    const { selectedSubmissionTypeId, currentProblem } = useContests();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ submissions, setSubmissions ] = useState<ISubmissionType[]>([]);
    const [ currentSubmissionCode, setCurrentSubmissionCode ] = useState<string>(defaultState.currentSubmissionCode);

    const {
        get: getSubmissionsForProfileRequest,
        data: getSubmissionsForProfileData,
    } = useHttp(getSubmissionsForProfileUrl);

    const {
        post: submitRequest,
        data: submitData,
    } = useHttp(submitUrl);

    const getUserSubmissions = useCallback(async () => {
        startLoading();
        await getSubmissionsForProfileRequest();
        stopLoading();
    }, [ getSubmissionsForProfileRequest, startLoading, stopLoading ]);

    const submit = useCallback(async () => {
        startLoading();
        await submitRequest({
            ProblemId: currentProblem?.id,
            SubmissionTypeId: selectedSubmissionTypeId,
            Content: currentSubmissionCode,
            Official: true,
        });
        stopLoading();
    }, [ startLoading, submitRequest, currentProblem, selectedSubmissionTypeId, currentSubmissionCode, stopLoading ]);

    const setCode = (code: string) => {
        setCurrentSubmissionCode(code);
    };

    useEffect(() => {
        if (getSubmissionsForProfileData != null) {
            setSubmissions(getSubmissionsForProfileData as ISubmissionType[]);
        }
    }, [ getSubmissionsForProfileData ]);

    useEffect(() => {
        if (submitData != null) {
            console.log(submitData);
        }
    }, [ submitData ]);

    const value = {
        submissions,
        getUserSubmissions,
        submit,
        currentSubmissionCode,
        setCode,
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
