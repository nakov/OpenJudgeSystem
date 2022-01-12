import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import IHaveChildrenProps from '../../components/common/IHaveChildrenProps';
import { useLoading } from '../use-loading';
import { useHttp } from '../use-http';
import { ITestRunType, ISubmissionType, ISubmissionDetailsType } from './types';
import { getSubmissionDetailsUrl } from '../../utils/urls';

interface ISubmissionsDetailsContext {
    setCurrentSubmissionId: (submissionId: number) => void;
    currentSubmission: ISubmissionDetailsType | undefined,
    getSubmissionDetails: () => Promise<void>,
}

const defaultState = { };

const SubmissionsDetailsContext = createContext<ISubmissionsDetailsContext>(defaultState as ISubmissionsDetailsContext);

interface ISubmissionsDetailsProviderProps extends IHaveChildrenProps {}

const SubmissionsDetailsProvider = ({ children }: ISubmissionsDetailsProviderProps) => {
    const { startLoading, stopLoading } = useLoading();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ currentSubmissionId, setCurrentSubmissionId ] = useState<number>();
    const [ currentSubmission, setCurrentSubmission ] = useState<ISubmissionDetailsType>();
    const getCurrentSubmissionDetailsUrl = useMemo(() => `${getSubmissionDetailsUrl}/${currentSubmissionId}`, [
        currentSubmissionId,
    ]);

    const {
        get: getSubmissionDetailsRequest,
        data: getSubmissionDetailsData,
    } = useHttp(getCurrentSubmissionDetailsUrl);

    const getSubmissionDetails = useCallback(async () => {
        if (currentSubmissionId != null) {
            startLoading();
            await getSubmissionDetailsRequest();
            stopLoading();
        }
    }, [ currentSubmissionId, getSubmissionDetailsRequest, startLoading, stopLoading ]);

    useEffect(() => {
        if (getSubmissionDetailsData != null) {
            setCurrentSubmission(getSubmissionDetailsData as ISubmissionDetailsType);
        }
    }, [ getSubmissionDetailsData ]);

    useEffect(() => {
        console.log(currentSubmission);
    });

    const value = {
        setCurrentSubmissionId,
        currentSubmission,
        getSubmissionDetails,
    };

    return (
        <SubmissionsDetailsContext.Provider value={value}>
            {children}
        </SubmissionsDetailsContext.Provider>
    );
};

const useSubmissionsDetails = () => useContext(SubmissionsDetailsContext);

export {
    useSubmissionsDetails,
};

export type { ISubmissionType, ITestRunType };

export default SubmissionsDetailsProvider;
