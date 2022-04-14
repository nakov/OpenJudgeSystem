import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { sum } from 'lodash';
import { IContestType, IStartParticipationResponseType } from '../common/types';

import { IHaveChildrenProps } from '../components/common/Props';

import { useLoading } from './use-loading';
import { useHttp } from './use-http';
import { startContestParticipationUrl } from '../utils/urls';

interface IStartContestArgs {
    id: number;
    isOfficial: boolean;
}

interface ICurrentContestContext {
    state: {
        contest: IContestType | null;
        score: number;
        maxScore: number;
        isOfficial: boolean;
    }
    actions: {
        start: (info: IStartContestArgs) => Promise<void>;
    },
}

const defaultState = {
    state: {
        contest: null,
        score: 0,
        maxScore: 0,
        isOfficial: false,
    },
};

const CurrentContestsContext = createContext<ICurrentContestContext>(defaultState as ICurrentContestContext);

interface ICurrentContestsProviderProps extends IHaveChildrenProps {
}

const CurrentContestsProvider = ({ children }: ICurrentContestsProviderProps) => {
    const [ contest, setContest ] = useState<IContestType | null>(defaultState.state.contest);
    const [ score, setScore ] = useState(defaultState.state.score);
    const [ maxScore, setMaxScore ] = useState(defaultState.state.maxScore);
    const [ isOfficial, setOfficial ] = useState(defaultState.state.isOfficial);

    const {
        startLoading,
        stopLoading,
    } = useLoading();

    const {
        get: getApiContest,
        data: apiContest,
    } = useHttp(startContestParticipationUrl);

    const start = useCallback(async ({ id, isOfficial: official }) => {
        startLoading();
        await getApiContest({
            id,
            official,
        });
        stopLoading();
    }, [ getApiContest, startLoading, stopLoading ]);

    useEffect(() => {
        if (apiContest != null) {
            const responseData = apiContest as IStartParticipationResponseType;
            const { contest: newContest, contestIsCompete } = responseData;

            setContest(newContest);
            setOfficial(contestIsCompete);
        }
    }, [ apiContest ]);

    useEffect(
        () => {
            const { problems } = contest || {};
            if (!problems) {
                return;
            }

            setScore(sum(problems.map((p) => p.points)));
        },
        [ contest ],
    );

    useEffect(
        () => {
            const { problems } = contest || {};
            if (!problems) {
                return;
            }

            setMaxScore(sum(problems.map((p) => p.maximumPoints)));
        },
        [ contest ],
    );

    const value = {
        state: {
            contest,
            score,
            maxScore,
            isOfficial,
        },
        actions: { start },
    };

    return (
        <CurrentContestsContext.Provider value={value}>
            {children}
        </CurrentContestsContext.Provider>
    );
};
const useCurrentContest = () => useContext(CurrentContestsContext);

export default CurrentContestsProvider;

export {
    useCurrentContest,
};
