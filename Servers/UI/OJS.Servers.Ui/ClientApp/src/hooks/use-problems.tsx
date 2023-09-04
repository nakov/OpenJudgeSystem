import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import first from 'lodash/first';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { IProblemType } from '../common/types';
import { IDownloadProblemResourceUrlParams } from '../common/url-types';
import { IHaveChildrenProps } from '../components/common/Props';
import { getDownloadProblemResourceUrl } from '../utils/urls';

import { useHashUrlParams } from './common/use-hash-url-params';
import { useCurrentContest } from './use-current-contest';
import { useHttp } from './use-http';

interface IProblemsContext {
    state: {
        problems: IProblemType[];
        currentProblem: IProblemType | null;
    };
    actions: {
        downloadProblemResourceFile: (resourceId: number) => Promise<void>;
        changeCurrentHash: () => void;
        selectCurrentProblem: (id: number) => void;
        initiateRedirectionToProblem: (problemId: number, url: string) => void;
        removeCurrentProblem: () => void;
        removeCurrentProblems: () => void;
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
    const [ isLoading, setIsLoading ] = useState(false);
    const [ problems, setProblems ] = useState(defaultState.state.problems);
    const [ currentProblem, setCurrentProblem ] = useState<IProblemType | null>(defaultState.state.currentProblem);
    const [ internalProblemId, setInternalProblemId ] = useState<number | null>();
    const [ problemResourceIdToDownload, setProblemResourceIdToDownload ] = useState<number | null>(null);

    const navigate = useNavigate();

    const {
        get: downloadProblemResource,
        response: downloadProblemResourceResponse,
        saveAttachment,
    } = useHttp<IDownloadProblemResourceUrlParams, Blob>({
        url: getDownloadProblemResourceUrl,
        parameters: { id: problemResourceIdToDownload },
    });

    const selectProblemById = useCallback(
        (problemId: number, isDefaultHashParam = false) => {
            const newProblem = problems.find((p) => p.id === problemId);

            if (isNil(newProblem)) {
                return;
            }

            setCurrentProblem(newProblem);
            const { orderBy } = newProblem;
            setHash(orderBy.toString(), isDefaultHashParam);
        },
        [ setHash, problems ],
    );

    const problemFromHash = useMemo(
        () => {
            const hashIndex = Number(hashParam) - 1;
            return problems[hashIndex];
        },
        [ hashParam, problems ],
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

    const removeCurrentProblems = useCallback(
        () => {
            setProblems(defaultState.state.problems);
        },
        [],
    );

    // use it to redirect to contest from externalPage (such as SearchPage) which will search for
    // his the problemId in the normalized problems and set it in the hash.
    const initiateRedirectionToProblem = useCallback(
        (problemId: number, url: string) => {
            setInternalProblemId(problemId);

            navigate(url);
        },
        [ navigate ],
    );

    const changeCurrentHash = useCallback(
        () => {
            const { id } = first(problems) || {};

            if (isNil(id)) {
                return;
            }

            if (!isNil(internalProblemId)) {
                selectProblemById(internalProblemId, true);
            } else if (isLoadedFromHash) {
                setCurrentProblem(problemFromHash);
            } else {
                selectProblemById(id, true);
            }
        },
        [ internalProblemId, isLoadedFromHash, problems, problemFromHash, selectProblemById ],
    );

    useEffect(
        () => {
            const { problems: newProblems } = contest || {};

            if (isNil(newProblems) || isEmpty(newProblems) || !isEmpty(problems)) {
                return;
            }

            const normalizedProblems = normalizeOrderBy(newProblems);
            setProblems(normalizedProblems);
        },
        [ contest, problems ],
    );

    const downloadProblemResourceFile = useCallback(async (resourceId: number) => {
        setProblemResourceIdToDownload(resourceId);
    }, []);

    const removeCurrentProblem = useCallback(
        () => {
            setCurrentProblem(defaultState.state.currentProblem);
        },
        [],
    );

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
                setIsLoading(true);
                await downloadProblemResource('blob');
                setIsLoading(false);
            })();

            setProblemResourceIdToDownload(null);
        },
        [ downloadProblemResource, problemResourceIdToDownload ],
    );

    const value = useMemo(
        () => ({
            state: {
                problems,
                currentProblem,
                isLoading,
            },
            actions: {
                selectCurrentProblem,
                downloadProblemResourceFile,
                changeCurrentHash,
                initiateRedirectionToProblem,
                removeCurrentProblem,
                removeCurrentProblems,
            },
        }),
        [ problems, currentProblem, isLoading, selectCurrentProblem, downloadProblemResourceFile, changeCurrentHash,
            initiateRedirectionToProblem, removeCurrentProblem, removeCurrentProblems ],
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
