import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { IContestModalInfoType } from '../common/types';
import { IHaveChildrenProps } from '../components/common/Props';

interface IContestModalContext {
    state: {
        isShowing: boolean;
        modalContest: IContestModalInfoType;
    };
    actions: {
        toggle: () => void;
        setModalContest: (contest: IContestModalInfoType) => void;
        setIsShowing: (isShowing: boolean) => void;
    };
}

type IContestModalProviderProps = IHaveChildrenProps

const defaultState = { state: { isShowing: true, modalContest: {} as IContestModalInfoType } };

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
            actions: { toggle, setModalContest, setIsShowing },
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
