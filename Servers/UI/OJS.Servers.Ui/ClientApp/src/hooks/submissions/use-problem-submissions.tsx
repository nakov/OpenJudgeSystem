import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import isNil from 'lodash/isNil';

import { IPagedResultType } from '../../common/types';
import { IHaveChildrenProps } from '../../components/common/Props';
import { getSubmissionResultsByProblemUrl } from '../../utils/urls';
import { useCurrentContest } from '../use-current-contest';
import { IErrorDataType, useHttp } from '../use-http';
import { usePages } from '../use-pages';

import { ISubmissionDetails } from './types';

interface IProblemSubmissionsContext {
    state: {
        submissions: ISubmissionDetails[] | null;
        problemSubmissionsError: IErrorDataType | null;
    };
    actions: {
        loadSubmissions: (problemId: number) => void;
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
    const [ submissions, setSubmissions ] = useState<ISubmissionDetails[] | null>(null);
    const [
        submissionResultsToGetParameters,
        setSubmissionResultsToGetParameters,
    ] = useState<IProblemSubmissionResultsRequestParametersType | null>(null);
    const [ previousProblemSubmissionsPage, setPreviousProblemSubmissionsPage ] = useState<number>(0);

    const { state: { isOfficial } } = useCurrentContest();
    const {
        state: { currentPage },
        populatePageInformation,
    } = usePages();

    const {
        get: getProblemSubmissions,
        data: apiProblemSubmissionsData,
        error: problemSubmissionsError,
    } = useHttp<IProblemSubmissionResultsRequestParametersType, IPagedResultType<ISubmissionDetails>>({
        url: getSubmissionResultsByProblemUrl,
        parameters: submissionResultsToGetParameters,
    });

    const changePreviousProblemSubmissionsPage = useCallback(
        (page: number) => {
            setPreviousProblemSubmissionsPage(page);
        },
        [],
    );

    const loadSubmissions = useCallback(
        (id: number) => {
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
        [ isOfficial, currentPage, previousProblemSubmissionsPage ],
    );

    useEffect(
        () => {
            if (isNil(apiProblemSubmissionsData)) {
                return;
            }

            if (!isNil(problemSubmissionsError)) {
                return;
            }

            const newSubmissionsData = apiProblemSubmissionsData as IPagedResultType<ISubmissionDetails>;
            const submissionsResult = newSubmissionsData.items as ISubmissionDetails[];

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
                isLoading,
            },
            actions: {
                loadSubmissions,
                changePreviousProblemSubmissionsPage,
            },
        }),
        [ loadSubmissions, submissions, problemSubmissionsError, isLoading, changePreviousProblemSubmissionsPage ],
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
