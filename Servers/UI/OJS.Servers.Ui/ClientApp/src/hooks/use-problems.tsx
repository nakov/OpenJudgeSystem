import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import first from 'lodash/first';
import isNil from 'lodash/isNil';

import { UrlType } from '../common/common-types';
import { IProblemType } from '../common/types';
import { IHaveChildrenProps } from '../components/common/Props';

import { useCurrentContest } from './use-current-contest';
import { useHttp } from './use-http';
import { useLoading } from './use-loading';
import { useUrls } from './use-urls';

interface IProblemsContext {
    state: {
        problems: IProblemType[];
        currentProblem: IProblemType | null;
    };
    actions: {
        selectProblemById: (id: number) => void;
        downloadProblemResourceFile: (resourceId: number) => Promise<void>;
    };
}

type IProblemsProviderProps = IHaveChildrenProps

const defaultState = {
    state: {
        problems: [] as IProblemType[],
        currentProblem: {} as IProblemType,
    },
};

const ProblemsContext = createContext<IProblemsContext>(defaultState as IProblemsContext);

const ProblemsProvider = ({ children }: IProblemsProviderProps) => {
    const { state: { contest } } = useCurrentContest();

    const [ problems, setProblems ] = useState(defaultState.state.problems);
    const [ currentProblem, setCurrentProblem ] = useState<IProblemType | null>(defaultState.state.currentProblem);
    const [ problemResourceIdToDownload, setProblemResourceIdToDownload ] = useState<number | null>();
    const { getDownloadProblemResourceUrl } = useUrls();

    const {
        startLoading,
        stopLoading,
    } = useLoading();

    const {
        get: downloadProblemResource,
        response: downloadProblemResourceResponse,
        saveAttachment,
    } = useHttp(getDownloadProblemResourceUrl as UrlType, { id: problemResourceIdToDownload });

    const selectProblemById = useCallback(
        (problemId: number) => {
            const newProblem = problems.find((p) => p.id === problemId);

            if (newProblem) {
                setCurrentProblem(newProblem);
            }
        },
        [ problems ],
    );

    const reloadProblems = useCallback(
        () => {
            const { problems: newProblems } = contest || {};

            if (!newProblems) {
                return;
            }

            setProblems(newProblems);
            const { id } = first(newProblems) || {};

            if (!id) {
                return;
            }

            selectProblemById(id);
        },
        [ contest, selectProblemById ],
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

    useEffect(() => {
        if (isNil(problemResourceIdToDownload)) {
            return;
        }

        (async () => {
            startLoading();
            await downloadProblemResource('blob');
            stopLoading();
        })();

        setProblemResourceIdToDownload(null);
    }, [ downloadProblemResource, problemResourceIdToDownload, startLoading, stopLoading ]);

    useEffect(
        () => {
            reloadProblems();
        },
        [ reloadProblems ],
    );

    const value = useMemo(
        () => ({
            state: {
                problems,
                currentProblem,
            },
            actions: {
                selectProblemById,
                downloadProblemResourceFile,
            },
        }),
        [ currentProblem, downloadProblemResourceFile, problems, selectProblemById ],
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
