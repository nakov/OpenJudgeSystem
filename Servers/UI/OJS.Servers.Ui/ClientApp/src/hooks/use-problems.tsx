import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { first } from 'lodash';
import { IProblemType } from '../common/types';
import { IFileResponseType } from '../common/common-types';
import { IHaveChildrenProps } from '../components/common/Props';
import { useCurrentContest } from './use-current-contest';
import { useHttp } from './use-http';
import { useLoading } from './use-loading';
import { getProblemResourceUrl } from '../utils/urls';

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

interface IProblemsProviderProps extends IHaveChildrenProps {
}

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

    const {
        startLoading,
        stopLoading,
    } = useLoading();

    const {
        get: getProblemResourceRequest,
        response: getProblemResourceResponse,
        saveAttachment,
    } = useHttp(getProblemResourceUrl);

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
        startLoading();
        await getProblemResourceRequest({ id: resourceId.toString() }, 'blob');
        stopLoading();
    }, [ getProblemResourceRequest, startLoading, stopLoading ]);

    useEffect(() => {
        if (getProblemResourceResponse != null) {
            saveAttachment(getProblemResourceResponse as IFileResponseType);
        }
    }, [ getProblemResourceResponse, saveAttachment ]);

    useEffect(
        () => {
            reloadProblems();
        },
        [ reloadProblems ],
    );

    const value = {
        state: {
            problems,
            currentProblem,
        },
        actions: {
            selectProblemById,
            downloadProblemResourceFile,
        },
    };

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
