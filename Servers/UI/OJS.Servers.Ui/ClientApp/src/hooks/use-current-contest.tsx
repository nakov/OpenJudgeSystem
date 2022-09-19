import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { isNil, sum } from 'lodash';
import { IContestType, IStartParticipationResponseType } from '../common/types';

import { IHaveChildrenProps } from '../components/common/Props';

import { useLoading } from './use-loading';
import { useHttp } from './use-http';
import { useUrls } from './use-urls';
import { UrlType } from '../common/common-types';

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
    };
    actions: {
        start: (info: IStartContestArgs) => void;
    };
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

interface IContestToStartType {
    id: number;
    isOfficial: boolean;
}

const CurrentContestsProvider = ({ children }: ICurrentContestsProviderProps) => {
    const [ contest, setContest ] = useState<IContestType | null>(defaultState.state.contest);
    const [ score, setScore ] = useState(defaultState.state.score);
    const [ maxScore, setMaxScore ] = useState(defaultState.state.maxScore);
    const [ isOfficial, setIsOfficial ] = useState(defaultState.state.isOfficial);
    const [ contestToStart, setContestToStart ] = useState<IContestToStartType | null>(null);

    const {
        startLoading,
        stopLoading,
    } = useLoading();

    const { getStartContestParticipationUrl } = useUrls();

    const {
        get: startContest,
        data: startContestData,
    } = useHttp(getStartContestParticipationUrl as UrlType, contestToStart);

    const start = useCallback((obj: IContestToStartType) => {
        setContestToStart(obj);
    }, []);

    useEffect(() => {
        if (isNil(startContestData)) {
            return;
        }

        const responseData = startContestData as IStartParticipationResponseType;
        const { contest: newContest, contestIsCompete } = responseData;

        setContest(newContest);
        setIsOfficial(contestIsCompete);
    }, [ startContestData ]);

    useEffect(() => {
        if (isNil(contestToStart)) {
            return;
        }

        (async () => {
            startLoading();
            await startContest();
            stopLoading();
        })();
    }, [ contestToStart, startContest, startLoading, stopLoading ]);

    useEffect(
        () => {
            const { problems } = contest || {};

            if (isNil(problems)) {
                return;
            }

            setScore(sum(problems.map((p) => p.points)));
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
