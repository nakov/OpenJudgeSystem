import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { IHaveChildrenProps } from '../../components/common/Props';
import { useHttp } from '../use-http';
import { useUrls } from '../use-urls';

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
    orderBy: number;
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

type IPublicSubmissionsProviderProps = IHaveChildrenProps

const PublicSubmissionsProvider = ({ children }: IPublicSubmissionsProviderProps) => {
    const [ isAvailable, setIsAvailable ] = useState<boolean>(false);
    const { getSubmissionsPublicUrl, getSubmissionsTotalCountUrl } = useUrls();
    const {
        get: getSubmissions,
        data: apiSubmissions,
    } = useHttp<null, IPublicSubmission[]>({ url: getSubmissionsPublicUrl });

    const {
        get: getTotalSubmissionsCount,
        data: apiTotalSubmissionsCount,
    } = useHttp({ url: getSubmissionsTotalCountUrl });

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
            if (isAvailable) {
                return;
            }

            await Promise.all([
                getSubmissions(),
                getTotalSubmissionsCount(),
            ]);

            setIsAvailable(true);
        },
        [ getSubmissions, getTotalSubmissionsCount, isAvailable ],
    );

    const value = useMemo(
        () => ({
            state: {
                submissions,
                totalSubmissionsCount,
            },
            actions: { load },
        }),
        [ submissions, totalSubmissionsCount, load ],
    );

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
    PublicSubmissionState,
};

export type {
    IPublicSubmission,
};
