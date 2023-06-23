import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { IIndexContestsType } from '../common/types';
import { IHaveChildrenProps } from '../components/common/Props';

interface IContestModalContext {
    state: {
        isShowing: boolean;
        modalContest: IIndexContestsType;
    };
    actions: {
        toggle: () => void;
        setModalContest: (contest: IIndexContestsType) => void;
    };
}

type IContestModalProviderProps = IHaveChildrenProps

const defaultState = { state: { isShowing: false, modalContest: {} as IIndexContestsType } };

const ContestModalContext = createContext<IContestModalContext>(defaultState as IContestModalContext);

const ContestModalProvider = ({ children }: IContestModalProviderProps) => {
    const [ isShowing, setIsShowing ] = useState<boolean>(defaultState.state.isShowing);
    const [ modalContest, setModalContest ] = useState(defaultState.state.modalContest);

    const toggle = useCallback(
        () => setIsShowing(!isShowing),
        [ isShowing ],
    );

    const value = useMemo(
        () => ({
            state: { isShowing, modalContest },
            actions: { toggle, setModalContest },
        }),
        [ isShowing, toggle, modalContest ],
    );

    return (
        <ContestModalContext.Provider value={value}>
            {children}
        </ContestModalContext.Provider>
    );
};

const useModal = () => useContext(ContestModalContext);

export default ContestModalProvider;

export {
    useModal,
};
