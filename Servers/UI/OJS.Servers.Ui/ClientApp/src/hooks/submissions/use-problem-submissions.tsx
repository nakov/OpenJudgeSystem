import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isNil from 'lodash/isNil';

import { IPagedResultType } from '../../common/types';
import { IHaveChildrenProps } from '../../components/common/Props';
import { getSubmissionResultsByProblemUrl } from '../../utils/urls';
import { useCurrentContest } from '../use-current-contest';
import { IErrorDataType, useHttp } from '../use-http';
import { usePages } from '../use-pages';

import { ISubmissionResults } from './types';

interface IProblemSubmissionsContext {
    state: {
        submissions: ISubmissionResults[] | null;
        problemSubmissionsPage: number;
        problemSubmissionsError: IErrorDataType | null;
    };
    actions: {
        loadSubmissions: (problemId: number, currentPage: number) => void;
        changeProblemSubmissionsPage: (page: number) => void;
        clearProblemSubmissionsPage: () => void;
        changePreviousProblemSubmissionsPage: (page: number) => void;
    };
}

type IProblemSubmissionsProviderProps = IHaveChildrenProps

interface IProblemSubmissionResultsRequestParametersType {
    problemId: number;
    isOfficial: boolean;
    page: number;
}

const ProblemSubmissionsContext = createContext<IProblemSubmissionsContext>({} as IProblemSubmissionsContext);

const ProblemSubmissionsProvider = ({ children }: IProblemSubmissionsProviderProps) => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ submissions, setSubmissions ] = useState<ISubmissionResults[] | null>(null);
    const [
        submissionResultsToGetParameters,
        setSubmissionResultsToGetParameters,
    ] = useState<IProblemSubmissionResultsRequestParametersType | null>(null);
    const [ problemSubmissionsPage, setProblemSubmissionsPage ] = useState<number>(1);
    const [ previousProblemSubmissionsPage, setPreviousProblemSubmissionsPage ] = useState<number>(0);

    const { state: { isOfficial } } = useCurrentContest();
    const { populatePageInformation } = usePages();

    const {
        get: getProblemSubmissions,
        data: apiProblemSubmissionsData,
        error: problemSubmissionsError,
    } = useHttp<IProblemSubmissionResultsRequestParametersType, IPagedResultType<ISubmissionResults>>({
        url: getSubmissionResultsByProblemUrl,
        parameters: submissionResultsToGetParameters,
    });

    const changePreviousProblemSubmissionsPage = useCallback(
        (page: number) => {
            setPreviousProblemSubmissionsPage(page);
        },
        [],
    );

    const changeProblemSubmissionsPage = useCallback(
        (page: number) => {
            setProblemSubmissionsPage(page);
        },
        [],
    );

    const clearProblemSubmissionsPage = useCallback(
        () => setProblemSubmissionsPage(1),
        [],
    );

    const loadSubmissions = useCallback(
        (id: number, currentPage: number) => {
            if (isNil(id) || isNil(isOfficial) || currentPage === previousProblemSubmissionsPage) {
                return;
            }

            setSubmissionResultsToGetParameters({
                problemId: id,
                isOfficial,
                page: currentPage,
            } as IProblemSubmissionResultsRequestParametersType);

            setPreviousProblemSubmissionsPage(0);
        },
        [ isOfficial, previousProblemSubmissionsPage ],
    );

    useEffect(
        () => {
            if (isNil(apiProblemSubmissionsData)) {
                return;
            }

            if (!isNil(problemSubmissionsError)) {
                return;
            }

            const newSubmissionsData = apiProblemSubmissionsData as IPagedResultType<ISubmissionResults>;
            const submissionsResult = newSubmissionsData.items as ISubmissionResults[];

            const {
                pageNumber,
                itemsPerPage,
                pagesCount,
                totalItemsCount,
            } = newSubmissionsData || {};

            const newPagesInfo = {
                pageNumber,
                itemsPerPage,
                pagesCount,
                totalItemsCount,
            };

            setSubmissions(submissionsResult);
            populatePageInformation(newPagesInfo);

            setSubmissionResultsToGetParameters(null);
        },
        [ apiProblemSubmissionsData, populatePageInformation, problemSubmissionsError ],
    );

    useEffect(
        () => {
            if (isNil(submissionResultsToGetParameters)) {
                return;
            }

            (async () => {
                setIsLoading(true);
                await getProblemSubmissions();
                setIsLoading(false);
            })();
        },
        [ getProblemSubmissions, submissionResultsToGetParameters ],
    );

    const value = useMemo(
        () => ({
            state: {
                submissions,
                problemSubmissionsError,
                problemSubmissionsPage,
                isLoading,
            },
            actions: {
                loadSubmissions,
                changePreviousProblemSubmissionsPage,
                changeProblemSubmissionsPage,
                clearProblemSubmissionsPage,
            },
        }),
        [ loadSubmissions, submissions, problemSubmissionsError, isLoading, changePreviousProblemSubmissionsPage,
            problemSubmissionsPage, changeProblemSubmissionsPage, clearProblemSubmissionsPage ],
    );

    return (
        <ProblemSubmissionsContext.Provider value={value}>
            {children}
        </ProblemSubmissionsContext.Provider>
    );
};

const useProblemSubmissions = () => useContext(ProblemSubmissionsContext);

export default ProblemSubmissionsProvider;

export {
    useProblemSubmissions,
};
