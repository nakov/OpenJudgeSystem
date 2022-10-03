import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { IHaveChildrenProps } from '../../components/common/Props';
import { useHttp } from '../use-http';

interface IPublicSubmissionContest {
    id: number;
    name: string;
}

interface IPublicSubmissionUser {
    id: string;
    username: string;
}

interface IPublicSubmissionProblem {
    id: number;
    name: string;
    contest: IPublicSubmissionContest;
}

interface IPublicSubmissionResult {
    points: number;
    maxPoints: number;
}

enum PublicSubmissionState {
    Ready = 1,
    Processing = 2,
    Queued = 3,
}

interface IPublicSubmission {
    id: number;
    createdOn: Date;
    strategyName: string;
    user: IPublicSubmissionUser;
    problem: IPublicSubmissionProblem;
    result: IPublicSubmissionResult;
    state: PublicSubmissionState;
    isOfficial: boolean;
}

interface IPublicSubmissionsContext {
    state: {
        totalSubmissionsCount: number;
        submissions: IPublicSubmission[];
    };
    actions: {
        load: () => Promise<void>;
    };
}

const defaultState = {};


const PublicSubmissionsContext = createContext<IPublicSubmissionsContext>(defaultState as IPublicSubmissionsContext);

interface IPublicSubmissionsProviderProps extends IHaveChildrenProps {
}

const PublicSubmissionsProvider = ({ children }: IPublicSubmissionsProviderProps) => {
    const {
        get: getSubmissions,
        data: apiSubmissions,
    } = useHttp('/api/submissions/public');

    const {
        get: getTotalSubmissionsCount,
        data: apiTotalSubmissionsCount,
    } = useHttp('/api/submissions/totalCount');

    const submissions = useMemo(
        () => (apiSubmissions || []) as IPublicSubmission[],
        [ apiSubmissions ],
    );

    const totalSubmissionsCount = useMemo(
        () => (apiTotalSubmissionsCount || 0) as number,
        [ apiTotalSubmissionsCount ],
    );

    const load = useCallback(
        async () => {
            await Promise.all([
                getSubmissions(),
                getTotalSubmissionsCount(),
            ]);
        },
        [ getSubmissions, getTotalSubmissionsCount ],
    );
    const value = {
        state: {
            submissions,
            totalSubmissionsCount,
        },
        actions: { load },
    };

    return (
        <PublicSubmissionsContext.Provider value={value}>
            {children}
        </PublicSubmissionsContext.Provider>
    );
};


const usePublicSubmissions = () => useContext(PublicSubmissionsContext);

export default PublicSubmissionsProvider;

export {
    usePublicSubmissions,
};

export type {
    IPublicSubmission,
};
