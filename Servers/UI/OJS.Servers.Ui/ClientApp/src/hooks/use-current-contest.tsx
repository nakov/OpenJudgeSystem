import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import isNil from 'lodash/isNil';
import sum from 'lodash/sum';

import {
    IContestDetailsResponseType,
    IContestType,
    IRegisterForContestResponseType,
    IStartParticipationResponseType,
} from '../common/types';
import {
    IContestDetailsUrlParams,
    IGetContestParticipationScoresForParticipantUrlParams,
    IRegisterForContestUrlParams,
    IStartContestParticipationUrlParams,
    ISubmitContestPasswordUrlParams,
} from '../common/url-types';
import { IHaveChildrenProps } from '../components/common/Props';
import { IAuthorizationReduxState } from '../redux/features/authorizationSlice';
import {
    getContestDetailsUrl,
    getContestParticipantScoresForParticipantUrl,
    getRegisterForContestUrl,
    getStartContestParticipationUrl,
    getSubmitContestPasswordUrl,
} from '../utils/urls';

import { IErrorDataType, useHttp } from './use-http';

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
        currentContestParticipantScores: IMaximumParticipantScores[];
        score: number;
        maxScore: number;
        isOfficial: boolean;
        requirePassword: boolean | null;
        contestPasswordError: IErrorDataType | null;
        isPasswordValid: boolean | null;
        endDateTimeForParticipantOrContest: Date | null;
        userSubmissionsTimeLimit: number;
        participantsCount: number;
        isSubmitAllowed: boolean;
        contestError: IErrorDataType | null;
        isRegisterForContestSuccessful: boolean;
        contestIsLoading: boolean;
        registerForContestLoading: boolean;
        contestDetailsIsLoading: boolean;
        submitContestPasswordIsLoading: boolean;
        getParticipantScoresIsLoading: boolean;
        userHasConfirmedModal: boolean;
        contestDetails: IContestDetailsResponseType | null;
        isContestDetailsLoadingSuccessful: boolean;
    };
    actions: {
        setContestPassword: (password: string) => void;
        start: (info: IStartContestArgs) => void;
        registerParticipant: (info: IStartContestArgs) => void;
        submitPassword: (info: ISubmitContestPasswordArgs) => void;
        loadParticipantScores: () => void;
        setIsSubmitAllowed: (isSubmitAllowed: boolean) => void;
        removeCurrentContest: () => void;
        setUserHasConfirmedModal: (userHasConfirmedModal: boolean) => void;
        clearContestError: () => void;
        getContestDetails: (info: IContestDetailsUrlParams) => void;
    };
}

const defaultState = {
    state: {
        contest: null,
        contestPassword: null,
        score: 0,
        maxScore: 0,
        isOfficial: false,
        isPasswordValid: false,
        userSubmissionsTimeLimit: 0,
        participantsCount: 0,
        userHasConfirmedModal: false,
        contestDetails: null,
    },
};

const CurrentContestsContext = createContext<ICurrentContestContext>(defaultState as ICurrentContestContext);

type ICurrentContestsProviderProps = IHaveChildrenProps

interface IContestToStartType {
    id: number;
    isOfficial: boolean;
}

type IMaximumParticipantScores = {
    problemId: number;
    points: number;
    testRunsCount: number;
}

type ISubmitContestPasswordType = {
    password?: string | null;
}

const CurrentContestsProvider = ({ children }: ICurrentContestsProviderProps) => {
    const [ contest, setContest ] = useState<IContestType | null>(defaultState.state.contest);
    const [ contestPassword, setContestPassword ] = useState<string | null>(defaultState.state.contestPassword);
    const [ participantId, setParticipantId ] = useState<number | null>(null);
    const [ score, setScore ] = useState(defaultState.state.score);
    const [ maxScore, setMaxScore ] = useState(defaultState.state.maxScore);
    const [ isOfficial, setIsOfficial ] = useState(defaultState.state.isOfficial);
    const [ requirePassword, setRequirePassword ] = useState<boolean | null>(null);
    const [ currentContestParticipantScores, setCurrentContestParticipantScores ] =
        useState<IMaximumParticipantScores[]>([]);
    const [ contestToStart, setContestToStart ] = useState<IContestToStartType | null>(null);
    const [ registerForContestParams, setRegisterForContestParams ] = useState<IRegisterForContestUrlParams | null>(null);
    const [
        getCurrentParticipantParticipantScoresParams,
        setGetCurrentParticipantParticipantScoresParams,
    ] = useState<IGetContestParticipationScoresForParticipantUrlParams | null>(null);
    const [ submitContestPasswordUrlParams, setSubmitContestPasswordUrlParams ] = useState<ISubmitContestPasswordUrlParams | null>(null);
    const [ contestPasswordError, setContestPasswordError ] = useState<IErrorDataType | null>(null);
    const [ isPasswordValid, setIsPasswordValid ] = useState<boolean>(defaultState.state.isPasswordValid);
    const [ userSubmissionsTimeLimit, setUserSubmissionsTimeLimit ] = useState<number>(0);
    const [ endDateTimeForParticipantOrContest, setEndDateTimeForParticipantOrContest ] = useState<Date | null>(null);
    const [ participantsCount, setParticipantsCount ] = useState(defaultState.state.participantsCount);
    const [ isSubmitAllowed, setIsSubmitAllowed ] = useState<boolean>(true);
    const [ contestError, setContestError ] = useState<IErrorDataType | null>(null);
    const [
        userHasConfirmedModal,
        setUserHasConfirmedModal,
    ] = useState<boolean>(defaultState.state.userHasConfirmedModal);

    const { internalUser: user } =
    useSelector((state: {authorization: IAuthorizationReduxState}) => state.authorization);
    const [ contestDetails, setContestDetails ] = useState<IContestDetailsResponseType | null>(defaultState.state.contestDetails);
    const [ contestDetailsParams, setContestDetailsParams ] = useState<IContestDetailsUrlParams | null>(null);

    const {
        isLoading: contestIsLoading,
        get: startContest,
        data: startContestData,
        error: startContestError,
    } = useHttp<IStartContestParticipationUrlParams, IStartParticipationResponseType>({
        url: getStartContestParticipationUrl,
        parameters: contestToStart,
    });

    const {
        isLoading: contestDetailsIsLoading,
        get: getContestDetailsData,
        data: contestDetailsData,
        error: contestDetailsErrorData,
        isSuccess: isContestDetailsLoadingSuccessful,
    } = useHttp<IContestDetailsUrlParams, IContestDetailsResponseType>({
        url: getContestDetailsUrl,
        parameters: contestDetailsParams,
    });

    const {
        isLoading: registerForContestLoading,
        get: registerForContest,
        data: registerForContestData,
        error: registerContestError,
        isSuccess: isRegisterForContestSuccessful,
    } = useHttp<IRegisterForContestUrlParams, IRegisterForContestResponseType>({
        url: getRegisterForContestUrl,
        parameters: registerForContestParams,
    });

    const {
        isLoading: submitContestPasswordIsLoading,
        post: submitContestPassword,
        response: submitContestPasswordResponse,
        error: submitContestPasswordError,
    } = useHttp<ISubmitContestPasswordUrlParams, null, ISubmitContestPasswordType>({
        url: getSubmitContestPasswordUrl,
        parameters: submitContestPasswordUrlParams,
    });

    const {
        isLoading: getParticipantScoresIsLoading,
        get: getParticipantScores,
        data: getParticipantScoresData,
    } = useHttp<IGetContestParticipationScoresForParticipantUrlParams, null>({
        url: getContestParticipantScoresForParticipantUrl,
        parameters: getCurrentParticipantParticipantScoresParams,
    });

    const getContestDetails = useCallback(({ id }: IContestDetailsUrlParams) => {
        setContestDetailsParams({ id });
    }, []);

    useEffect(() => {
        if (isNil(contestDetailsParams)) {
            return;
        }

        (async () => {
            await getContestDetailsData();
        })();
    }, [
        contestDetailsParams,
        getContestDetailsData,
    ]);

    useEffect(
        () => {
            if (isNil(contestDetailsData)) {
                return;
            }

            if (!isNil(contestDetailsErrorData)) {
                setContestError(contestDetailsErrorData);
                return;
            }

            setContestDetails(contestDetailsData);
            setContestError(null);
        },
        [ contestDetailsData, contestDetailsErrorData ],
    );

    const start = useCallback((obj: IContestToStartType) => {
        setContestToStart(obj);
    }, []);

    const registerParticipant = useCallback((obj: IStartContestArgs) => {
        const { id, isOfficial: official } = obj;

        setRegisterForContestParams({ id, isOfficial: official } as IRegisterForContestUrlParams);
    }, []);

    const submitPassword = useCallback(({ id, isOfficial: official, password }: ISubmitContestPasswordArgs) => {
        setSubmitContestPasswordUrlParams({
            id,
            isOfficial: official,
        } as ISubmitContestPasswordUrlParams);
        setContestPassword(password);
    }, []);

    const loadParticipantScores = useCallback(async () => {
        if (isNil(participantId)) {
            return;
        }

        setGetCurrentParticipantParticipantScoresParams({ participantId } as IGetContestParticipationScoresForParticipantUrlParams);
    }, [ participantId ]);

    const removeCurrentContest = useCallback(
        () => {
            setContest(defaultState.state.contest);
        },
        [],
    );

    const clearContestError = useCallback(
        () => {
            setContestError(null);
        },
        [],
    );

    useEffect(() => {
        if (isNil(getCurrentParticipantParticipantScoresParams)) {
            return;
        }

        (async () => {
            await getParticipantScores();
        })();
    }, [
        getCurrentParticipantParticipantScoresParams,
        getParticipantScores,
    ]);

    useEffect(() => {
        if (isNil(getParticipantScoresData)) {
            return;
        }

        setCurrentContestParticipantScores(getParticipantScoresData);
        setGetCurrentParticipantParticipantScoresParams(null);
    }, [
        getParticipantScores,
        getParticipantScoresData,
    ]);

    useEffect(() => {
        if (isNil(registerForContestParams)) {
            return;
        }

        const { id } = registerForContestParams;
        if (Number.isNaN(id)) {
            return;
        }

        (async () => {
            await registerForContest();
        })();
    }, [ registerForContest, registerForContestParams ]);

    useEffect(
        () => {
            if (isNil(registerForContestData)) {
                return;
            }

            if (!isNil(registerContestError)) {
                setContestError(registerContestError);
                return;
            }

            const { requirePassword: responseRequirePassword } = registerForContestData;

            setContest({
                id: registerForContestData.id,
                name: registerForContestData.name,
                isOnline: registerForContestData.isOnlineExam,
                duration: registerForContestData.duration,
                numberOfProblems: registerForContestData.numberOfProblems,
                categoryId: registerForContestData.categoryId,
            } as IContestType);

            const { participantId: registerParticipantId } = registerForContestData;
            if (!isNil(registerParticipantId) || user?.isAdmin) {
                setUserHasConfirmedModal(true);
            }

            setRequirePassword(responseRequirePassword);
            setContestError(null);
        },
        [ registerForContestData, registerContestError, user?.isAdmin ],
    );

    useEffect(() => {
        if (isNil(submitContestPasswordUrlParams)) {
            return;
        }

        (async () => {
            await submitContestPassword({ password: contestPassword });
        })();
    }, [ contestPassword, submitContestPassword, submitContestPasswordUrlParams ]);

    useEffect(
        () => {
            if (isNil(submitContestPasswordResponse)) {
                return;
            }

            if (!isNil(submitContestPasswordError)) {
                setContestPasswordError(submitContestPasswordError);
                setIsPasswordValid(false);

                return;
            }

            setIsPasswordValid(true);
            setContestPasswordError(null);
        },
        [ registerForContestData, submitContestPasswordError, submitContestPasswordResponse ],
    );

    useEffect(() => {
        if (isNil(contestToStart)) {
            return;
        }

        const { id } = contestToStart;
        if (Number.isNaN(id)) {
            return;
        }

        (async () => {
            await startContest();
        })();
    }, [ contestToStart, startContest ]);

    useEffect(
        () => {
            if (isNil(startContestData)) {
                return;
            }

            if (!isNil(startContestError)) {
                setContestError(startContestError);
                setUserHasConfirmedModal(false);
                return;
            }

            const {
                contest: newContest,
                contestIsCompete,
                participantId: currentParticipantId,
                endDateTimeForParticipantOrContest: newEndDateTimeForParticipantOrContest,
                participantsCount: newParticipantsCount,
            } = startContestData;

            setContest(newContest);
            setIsOfficial(contestIsCompete);
            setParticipantId(currentParticipantId);
            setEndDateTimeForParticipantOrContest(newEndDateTimeForParticipantOrContest);
            setUserSubmissionsTimeLimit(startContestData.userSubmissionsTimeLimit);
            setParticipantsCount(newParticipantsCount);

            setRequirePassword(null);
            setIsPasswordValid(defaultState.state.isPasswordValid);
        },
        [ startContestData, startContestError ],
    );

    useEffect(
        () => {
            const { problems } = contest || {};

            if (isNil(problems)) {
                return;
            }

            const currentScore = sum(currentContestParticipantScores.map((p) => isNil(p.points)
                ? 0
                : p.points));

            const currentMaxScore = sum(problems.map((p) => p.maximumPoints));

            setScore(currentScore);
            setMaxScore(currentMaxScore);
        },
        [ contest, currentContestParticipantScores ],
    );

    useEffect(() => {
        if (isNil(participantId)) {
            return;
        }

        (async () => {
            await loadParticipantScores();
        })();
    }, [ loadParticipantScores, participantId ]);

    const value = useMemo(
        () => ({
            state: {
                contest,
                currentContestParticipantScores,
                contestPassword,
                score,
                maxScore,
                isOfficial,
                requirePassword,
                contestPasswordError,
                isPasswordValid,
                endDateTimeForParticipantOrContest,
                userSubmissionsTimeLimit,
                participantsCount,
                isSubmitAllowed,
                contestError,
                isRegisterForContestSuccessful,
                userHasConfirmedModal,
                contestIsLoading,
                registerForContestLoading,
                submitContestPasswordIsLoading,
                getParticipantScoresIsLoading,
                contestDetails,
                contestDetailsIsLoading,
                isContestDetailsLoadingSuccessful,
            },
            actions: {
                setContestPassword,
                registerParticipant,
                start,
                submitPassword,
                loadParticipantScores,
                setIsSubmitAllowed,
                setUserHasConfirmedModal,
                getContestDetails,
                removeCurrentContest,
                clearContestError,
            },
        }),
        [
            contest,
            contestPassword,
            currentContestParticipantScores,
            isOfficial,
            isPasswordValid,
            maxScore,
            registerParticipant,
            endDateTimeForParticipantOrContest,
            userSubmissionsTimeLimit,
            requirePassword,
            score,
            start,
            contestPasswordError,
            submitPassword,
            loadParticipantScores,
            participantsCount,
            isSubmitAllowed,
            setIsSubmitAllowed,
            contestError,
            clearContestError,
            isRegisterForContestSuccessful,
            userHasConfirmedModal,
            removeCurrentContest,
            setUserHasConfirmedModal,
            contestIsLoading,
            registerForContestLoading,
            submitContestPasswordIsLoading,
            getParticipantScoresIsLoading,
            getContestDetails,
            contestDetails,
            contestDetailsIsLoading,
            isContestDetailsLoadingSuccessful,
        ],
    );

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
