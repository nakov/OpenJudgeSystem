import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { first } from 'lodash';
import { IProblemType } from '../common/types';
import { IHaveChildrenProps } from '../components/common/Props';
import { useCurrentContest } from './use-current-contest';

interface IProblemsContext {
    state: {
        problems: IProblemType[];
        currentProblem: IProblemType | null;
    };
    actions: {
        selectProblemById: (id: number) => void;
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
        actions: { selectProblemById },
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
