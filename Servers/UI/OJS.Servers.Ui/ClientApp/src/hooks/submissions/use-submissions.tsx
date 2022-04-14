import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useLoading } from '../use-loading';
import { useHttp } from '../use-http';
import { ITestRunType, ISubmissionType } from './types';
import { getSubmissionsForProfileUrl, submitUrl } from '../../utils/urls';
import { useContests } from '../use-contests';
import { IHaveChildrenProps } from '../../components/common/Props';

interface ISubmissionsContext {
    submissions: ISubmissionType[]
    currentSubmissionCode: string,
    getUserSubmissions: () => Promise<void>
    submit: () => Promise<void>
    setCode: (code: string) => void;
}

const defaultState = {
    currentSubmissionCode: `
function hello() {
    alert('Hello world!');
}
`,
};

const SubmissionsContext = createContext<ISubmissionsContext>(defaultState as ISubmissionsContext);

interface ISubmissionsProviderProps extends IHaveChildrenProps {}

const SubmissionsProvider = ({ children }: ISubmissionsProviderProps) => {
    const { startLoading, stopLoading } = useLoading();
    const { selectedSubmissionTypeId, currentProblem, isContestParticipationOfficial } = useContests();
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
            Official: isContestParticipationOfficial,
        });
        stopLoading();
    }, [
        startLoading,
        submitRequest,
        currentProblem?.id,
        selectedSubmissionTypeId,
        currentSubmissionCode,
        isContestParticipationOfficial,
        stopLoading ]);

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
