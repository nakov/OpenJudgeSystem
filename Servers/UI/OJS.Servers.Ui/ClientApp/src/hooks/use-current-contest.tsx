import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { isNil, sum } from 'lodash';
import { IContestType, IRegisterForContestResponseType, IStartParticipationResponseType } from '../common/types';
import { IHaveChildrenProps } from '../components/common/Props';
import { UrlType } from '../common/common-types';
import { IRegisterForContestUrlParams, ISubmitContestPasswordUrlParams } from '../common/url-types';
import { useLoading } from './use-loading';
import { useHttp } from './use-http';
import { useUrls } from './use-urls';

interface IStartContestArgs {
    id: number;
    isOfficial: boolean;
}

interface ISubmitContestPasswordArgs {
    id: number;
    isOfficial: boolean;
    password: string;
}

interface ICurrentContestContext {
    state: {
        contest: IContestType | null;
        contestPassword: string | null;
        score: number;
        maxScore: number;
        isOfficial: boolean;
        requirePassword: boolean | null;
        submitContestPasswordErrorMessage: string | null;
        isPasswordValid: boolean | null;
    };
    actions: {
        setContestPassword: (password: string) => void;
        start: (info: IStartContestArgs) => void;
        register: (info: IStartContestArgs) => void;
        submitPassword: (info: ISubmitContestPasswordArgs) => void;
    };
}

const defaultState = {
    state: {
        contest: null,
        contestPassword: null,
        score: 0,
        maxScore: 0,
        isOfficial: false,
        requirePassword: false,
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
    const [ contestPassword, setContestPassword ] = useState<string | null>(defaultState.state.contest);
    const [ score, setScore ] = useState(defaultState.state.score);
    const [ maxScore, setMaxScore ] = useState(defaultState.state.maxScore);
    const [ isOfficial, setIsOfficial ] = useState(defaultState.state.isOfficial);
    const [ requirePassword, setRequirePassword ] = useState<boolean | null>(null);
    const [ contestToStart, setContestToStart ] = useState<IContestToStartType | null>(null);
    const [ registerForContestParams, setRegisterForContestParams ] = useState<IRegisterForContestUrlParams | null>(null);
    const [ submitContestPasswordUrlParams, setSubmitContestPasswordUrlParams ] = useState<ISubmitContestPasswordUrlParams | null>(null);
    const [ submitContestPasswordErrorMessage, setSubmitContestPasswordErrorMessage ] = useState<string | null>(null);
    const [ isPasswordValid, setIsPasswordValid ] = useState<boolean | null>(null);

    const {
        startLoading,
        stopLoading,
    } = useLoading();

    const {
        getStartContestParticipationUrl,
        getRegisterForContestUrl,
        getSubmitContestPasswordUrl,
    } = useUrls();

    const {
        get: startContest,
        data: startContestData,
    } = useHttp(getStartContestParticipationUrl as UrlType, contestToStart);

    const {
        get: registerForContest,
        data: registerForContestData,
    } = useHttp(getRegisterForContestUrl as UrlType, registerForContestParams);

    const {
        post: submitContestPassword,
        data: submitContestPasswordData,
        response: submitContestPasswordResponse,
    } = useHttp(getSubmitContestPasswordUrl as UrlType, submitContestPasswordUrlParams);

    const start = useCallback((obj) => {
        setContestToStart(obj);
    }, []);

    const register = useCallback((obj) => {
        setRegisterForContestParams({ id: obj.id, isOfficial: obj.isOfficial } as IRegisterForContestUrlParams);
    }, []);

    const submitPassword = useCallback(({ id, isOfficial: official, password }: ISubmitContestPasswordArgs) => {
        setSubmitContestPasswordUrlParams({
            id,
            isOfficial: official,
        } as ISubmitContestPasswordUrlParams);
        setContestPassword(password);
    }, []);

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
        if (isNil(registerForContestParams)) {
            return;
        }

        (async () => {
            startLoading();
            await registerForContest();
            stopLoading();
        })();
    }, [ registerForContest, registerForContestParams, startLoading, stopLoading ]);

    useEffect(() => {
        if (isNil(registerForContestData)) {
            return;
        }

        const responseData = registerForContestData as IRegisterForContestResponseType;
        const { requirePassword: responseRequirePassword } = responseData;

        setContest({ id: responseData.id, name: responseData.name } as IContestType);
        setRequirePassword(responseRequirePassword);
    }, [ registerForContestData ]);

    useEffect(() => {
        if (isNil(submitContestPasswordUrlParams)) {
            return;
        }

        (async () => {
            startLoading();
            await submitContestPassword({ password: contestPassword });
            stopLoading();
        })();
    }, [ contestPassword, submitContestPassword, submitContestPasswordUrlParams, startLoading, stopLoading ]);

    useEffect(() => {
        if (isNil(submitContestPasswordData)) {
            return;
        }

        // TODO: fix this https://github.com/SoftUni-Internal/exam-systems-issues/issues/224
        if (!isNil(submitContestPasswordResponse) && submitContestPasswordResponse.status !== 200) {
            setSubmitContestPasswordErrorMessage('Incorrect password');
            setIsPasswordValid(false);
            return;
        }

        setIsPasswordValid(true);
        setSubmitContestPasswordErrorMessage(null);
    }, [ registerForContestData, submitContestPasswordData, submitContestPasswordResponse ]);

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
            contestPassword,
            score,
            maxScore,
            isOfficial,
            requirePassword,
            submitContestPasswordErrorMessage,
            isPasswordValid,
        },
        actions: {
            setContestPassword,
            register,
            start,
            submitPassword,
        },
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
