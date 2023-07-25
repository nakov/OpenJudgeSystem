import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import first from 'lodash/first';
import isNil from 'lodash/isNil';

import { ContestParticipationType } from '../common/constants';
import { IProblemType } from '../common/types';
import { IDownloadProblemResourceUrlParams } from '../common/url-types';
import { IHaveChildrenProps } from '../components/common/Props';
import { getDownloadProblemResourceUrl } from '../utils/urls';

import { useHashUrlParams } from './common/use-hash-url-params';
import { useAppUrls } from './use-app-urls';
import { useCurrentContest } from './use-current-contest';
import { useHttp } from './use-http';
import { useLoading } from './use-loading';

interface IProblemsContext {
    state: {
        problems: IProblemType[];
        currentProblem: IProblemType | null;
    };
    actions: {
        downloadProblemResourceFile: (resourceId: number) => Promise<void>;
        initiateProblems: () => void;
        selectCurrentProblem: (id: number) => void;
        initiateRedirectionToProblem: (problemId: number, contestId: number, participationType: ContestParticipationType) => void;
    };
}

type IProblemsProviderProps = IHaveChildrenProps

const defaultState = {
    state: {
        problems: [] as IProblemType[],
        currentProblem: {} as IProblemType,
    },
};

const normalizeOrderBy = (problems: IProblemType[]) => {
    problems.sort((x, y) => x.orderBy - y.orderBy);

    return problems.map((p, i) => ({
        ...p,
        orderBy: i + 1,
    }));
};

const ProblemsContext = createContext<IProblemsContext>(defaultState as IProblemsContext);

const ProblemsProvider = ({ children }: IProblemsProviderProps) => {
    const { state: { contest } } = useCurrentContest();
    const {
        state: { hashParam },
        actions: { setHash },
    } = useHashUrlParams();
    const [ problems, setProblems ] = useState(defaultState.state.problems);
    const [ currentProblem, setCurrentProblem ] = useState<IProblemType | null>(defaultState.state.currentProblem);
    const [ internalProblemId, setInternalProblemId ] = useState<number | null>();
    const [ problemResourceIdToDownload, setProblemResourceIdToDownload ] = useState<number | null>(null);

    const {
        startLoading,
        stopLoading,
    } = useLoading();

    const { getParticipateInContestUrl } = useAppUrls();
    const navigate = useNavigate();

    const {
        get: downloadProblemResource,
        response: downloadProblemResourceResponse,
        saveAttachment,
    } = useHttp<IDownloadProblemResourceUrlParams, Blob>({
        url: getDownloadProblemResourceUrl,
        parameters: { id: problemResourceIdToDownload },
    });

    const normalizedProblems = useMemo(
        () => normalizeOrderBy(problems),
        [ problems ],
    );

    const selectProblemById = useCallback(
        (problemId: number, isDefaultHashParam = false) => {
            const newProblem = normalizedProblems.find((p) => p.id === problemId);

            if (isNil(newProblem)) {
                return;
            }

            setCurrentProblem(newProblem);
            const { orderBy } = newProblem;
            setHash(orderBy.toString(), isDefaultHashParam);
        },
        [ setHash, normalizedProblems ],
    );

    const problemFromHash = useMemo(
        () => {
            const hashIndex = Number(hashParam) - 1;
            return normalizedProblems[hashIndex];
        },
        [ hashParam, normalizedProblems ],
    );

    const isLoadedFromHash = useMemo(
        () => !isNil(problemFromHash),
        [ problemFromHash ],
    );

    const selectCurrentProblem = useCallback(
        (problemId: number) => {
            selectProblemById(problemId);

            setInternalProblemId(null);
        },
        [ selectProblemById ],
    );

    // use it to redirect to contest from externalPage (such as SearchPage) which will search for
    // his the problemId in the normalized problems and set it in the hash.
    const initiateRedirectionToProblem = useCallback(
        (problemId: number, contestId: number, participationType: ContestParticipationType) => {
            const participateInContestUrl = getParticipateInContestUrl({
                id: contestId,
                participationType,
            });

            navigate(participateInContestUrl);

            setInternalProblemId(problemId);
        },
        [ getParticipateInContestUrl, navigate ],
    );

    const initiateProblems = useCallback(
        () => {
            const { problems: newProblems } = contest || {};

            if (!newProblems) {
                return;
            }

            setProblems(newProblems);
            const { id } = first(normalizedProblems) || {};

            if (isNil(id)) {
                return;
            }

            if (!isNil(internalProblemId)) {
                selectProblemById(internalProblemId);
            } else if (isLoadedFromHash) {
                setCurrentProblem(problemFromHash);
            } else {
                selectProblemById(id, true);
            }
        },
        [ contest, internalProblemId, isLoadedFromHash, normalizedProblems, problemFromHash, selectProblemById ],
    );

    const downloadProblemResourceFile = useCallback(async (resourceId: number) => {
        setProblemResourceIdToDownload(resourceId);
    }, []);

    useEffect(() => {
        if (isNil(downloadProblemResourceResponse)) {
            return;
        }

        saveAttachment();
    }, [ downloadProblemResourceResponse, problemResourceIdToDownload, saveAttachment ]);

    useEffect(
        () => {
            if (isNil(problemResourceIdToDownload)) {
                return;
            }

            (async () => {
                startLoading();
                await downloadProblemResource('blob');
                stopLoading();
            })();

            setProblemResourceIdToDownload(null);
        },
        [ downloadProblemResource, problemResourceIdToDownload, startLoading, stopLoading ],
    );

    const value = useMemo(
        () => ({
            state: {
                problems,
                currentProblem,
            },
            actions: {
                selectCurrentProblem,
                downloadProblemResourceFile,
                initiateProblems,
                initiateRedirectionToProblem,
            },
        }),
        [ currentProblem, downloadProblemResourceFile, initiateRedirectionToProblem, initiateProblems, problems, selectCurrentProblem ],
    );

    return (
        <ProblemsContext.Provider value={value}>
            {children}
        </ProblemsContext.Provider>
    );
};

const useProblems = () => useContext(ProblemsContext);

export {
    useProblems,
};

export default ProblemsProvider;
