import React, { createContext, useContext, useMemo, useState } from 'react';

import { IContestModalInfoType } from '../common/types';
import { IHaveChildrenProps } from '../components/common/Props';

interface IContestModalContext {
    state: {
        modalContest: IContestModalInfoType;
    };
    actions: {
        setModalContest: (contest: IContestModalInfoType) => void;
    };
}

type IContestModalProviderProps = IHaveChildrenProps

const defaultState = { state: { modalContest: {} as IContestModalInfoType } };

const ContestModalContext = createContext<IContestModalContext>(defaultState as IContestModalContext);

const ContestModalProvider = ({ children }: IContestModalProviderProps) => {
    const [ modalContest, setModalContest ] = useState(defaultState.state.modalContest);

    const value = useMemo(
        () => ({
            state: { modalContest },
            actions: { setModalContest },
        }),
        [ modalContest ],
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
