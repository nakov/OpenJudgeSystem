import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { IKeyValuePair } from '../../common/common-types';
import { IPage, IPagedResultType, ISubmissionResponseModel } from '../../common/types';
import {
    IGetSubmissionsByContestIdParams, IGetUserSubmissionsForProfileByContestUrlParams,
    IGetUserSubmissionsForProfileUrlParams,
    IUserInfoUrlParams,
} from '../../common/url-types';
import { IHaveChildrenProps } from '../../components/common/Props';
import isNilOrEmpty from '../../utils/check-utils';
import {
    decodeUsernameFromUrlParam,
    getAllParticipationsForUserUrl,
    getSubmissionsByContestIdUrl, getSubmissionsForProfileUrl,
} from '../../utils/urls';
import { useAuth } from '../use-auth';
import { useHttp } from '../use-http';
import { usePages } from '../use-pages';
import { IParticipationType } from '../use-participations';

interface IProfileSubmissionsContext {
    state: {
        usernameForProfile : string;
        userSubmissions: ISubmissionResponseModel[];
        userSubmissionsLoading: boolean;
        userByContestSubmissions: ISubmissionResponseModel[];
        userSubmissionUrlParams?: IPage;
        submissionsByContestParams?: IGetUserSubmissionsForProfileByContestUrlParams;
        menuItems: IKeyValuePair<string>[];
    };
    actions : {
        initiateSubmissionsByContestForProfileQuery: (username:string, submissionsPage: number, contestId: string) => void;
        initiateUserSubmissionsForProfileQuery: (username: string, submissionsPage: number) => void;
        getDecodedUsernameFromProfile : () => string;
        setUsernameForProfile : (username: string) => void;
    };
}

const defaultState = {
    state: {
        usernameForProfile: '',
        userSubmissions: [] as ISubmissionResponseModel[],
        userByContestSubmissions: [] as ISubmissionResponseModel[],
        submissionsByContestParams: { username: '', page: 1, contestId: '' },
        menuItems: [] as IKeyValuePair<string>[],
    },
};

const ProfileSubmissionsContext = createContext<IProfileSubmissionsContext>(defaultState as IProfileSubmissionsContext);
type IProfileSubmissionsProviderProps = IHaveChildrenProps
const ProfileSubmissionsProvider = ({ children }: IProfileSubmissionsProviderProps) => {
    const [ usernameForProfile, setUsernameForProfile ] = useState(defaultState.state.usernameForProfile);
    const [ userSubmissions, setUserSubmissions ] = useState<ISubmissionResponseModel[]>(defaultState.state.userSubmissions);
    const [
        userByContestSubmissions,
        setUserByContestSubmissions,
    ] = useState<ISubmissionResponseModel[]>(defaultState.state.userByContestSubmissions);
    const [
        userSubmissionsForProfileUrlParams,
        setUserSubmissionsForProfileUrlParams,
    ] = useState<IGetUserSubmissionsForProfileUrlParams | null>(null);
    const [
        submissionsByContestIdParams,
        setSubmissionsByContestIdParams,
    ] = useState<IGetSubmissionsByContestIdParams | null>(defaultState.state.submissionsByContestParams);
    const [ selectMenuItems, setSelectMenuItems ] = useState<IKeyValuePair<string>[]>(defaultState.state.menuItems);
    const [ getParticipationsForProfileUrlParam, setParticipationsForProfileUrlParam ] =
        useState<IUserInfoUrlParams | null>();

    const { state: { user } } = useAuth();
    const location = useLocation();
    const { pathname } = location;
    const { populatePageInformation } = usePages();

    const {
        isLoading: userSubmissionsLoading,
        get: getUserSubmissions,
        data: userSubmissionsData,
    } = useHttp<
        IGetUserSubmissionsForProfileUrlParams,
        IPagedResultType<ISubmissionResponseModel>>({
            url: getSubmissionsForProfileUrl,
            parameters: userSubmissionsForProfileUrlParams,
        });

    const {
        get: getUserByContestSubmissions,
        data: userByContestSubmissionsData,
    } = useHttp<
        IGetSubmissionsByContestIdParams,
        IPagedResultType<ISubmissionResponseModel>>({
            url: getSubmissionsByContestIdUrl,
            parameters: submissionsByContestIdParams,
        });

    const {
        get: getUserParticipations,
        data: userParticipationsData,
    } = useHttp<IUserInfoUrlParams, IParticipationType[]>({
        url: getAllParticipationsForUserUrl,
        parameters: getParticipationsForProfileUrlParam,
    });

    const initiateUserSubmissionsForProfileQuery = useCallback(
        (username : string, submissionsPage: number) => {
            setUserSubmissionsForProfileUrlParams({ username, page: submissionsPage });
        },
        [],
    );

    const getDecodedUsernameFromProfile = useCallback(
        () => decodeUsernameFromUrlParam(usernameForProfile),
        [ usernameForProfile ],
    );

    const initiateSubmissionsByContestForProfileQuery = useCallback(
        (username : string, submissionsPage: number, contestId: string) => {
            const queryParams = {
                username,
                contestId,
                page: submissionsPage,
            };

            setSubmissionsByContestIdParams(queryParams);
        },
        [ ],
    );

    const processSubmissionsQueryResult = useCallback(
        (
            queryResult: IPagedResultType<ISubmissionResponseModel>,
            handleSetData: (submissions: ISubmissionResponseModel[]) => void,
        ) => {
            const newSubmissionsData = queryResult.items as ISubmissionResponseModel[];
            const {
                pageNumber,
                itemsPerPage,
                pagesCount,
                totalItemsCount,
            } = queryResult;

            const newPagesInfo = {
                pageNumber,
                itemsPerPage,
                pagesCount,
                totalItemsCount,
            };

            handleSetData(newSubmissionsData);
            populatePageInformation(newPagesInfo);
        },
        [ populatePageInformation ],
    );

    useEffect(
        () => {
            const mappedMenuItems = (userParticipationsData ||
                []).map((item: IParticipationType) => ({
                key: item.id.toString(),
                value: item.contestName,
            }));

            setSelectMenuItems(mappedMenuItems);
        },
        [ userParticipationsData ],
    );

    useEffect(
        () => {
            if (isNilOrEmpty(userSubmissionsData) || !isEmpty(getParticipationsForProfileUrlParam)) {
                return;
            }

            const pathSegments = pathname.split('/').filter(Boolean);

            if (pathSegments.length > 1) {
                const decodedUsername = decodeUsernameFromUrlParam(pathSegments[1]);
                setParticipationsForProfileUrlParam({ username: decodedUsername });
                return;
            }

            const { username } = user;
            setParticipationsForProfileUrlParam({ username });
        },
        [ getUserParticipations, user, userSubmissionsData, getParticipationsForProfileUrlParam, pathname ],
    );

    useEffect(
        () => {
            if (isNil(getParticipationsForProfileUrlParam)) {
                return;
            }

            (async () => {
                await getUserParticipations();
            })();
        },
        [ getParticipationsForProfileUrlParam, getUserParticipations ],
    );

    useEffect(
        () => {
            if (isNil(userSubmissionsData) || isEmpty(userSubmissionsData)) {
                return;
            }

            processSubmissionsQueryResult(userSubmissionsData, setUserSubmissions);
        },
        [ processSubmissionsQueryResult, userSubmissionsData ],
    );

    useEffect(
        () => {
            if (isNil(userByContestSubmissionsData) || isEmpty(userByContestSubmissionsData)) {
                return;
            }

            processSubmissionsQueryResult(userByContestSubmissionsData, setUserByContestSubmissions);
        },
        [ userByContestSubmissionsData, setUserByContestSubmissions, processSubmissionsQueryResult ],
    );

    useEffect(
        () => {
            if (isNil(userSubmissionsForProfileUrlParams)) {
                return;
            }

            (async () => {
                await getUserSubmissions();
            })();
        },
        [ getUserSubmissions, userSubmissionsForProfileUrlParams ],
    );

    useEffect(
        () => {
            if (isNil(submissionsByContestIdParams)) {
                return;
            }

            const { contestId } = submissionsByContestIdParams;

            if (isNil(contestId) || isEmpty(contestId)) {
                return;
            }

            (async () => {
                await getUserByContestSubmissions();
            })();
        },
        [ submissionsByContestIdParams, getUserByContestSubmissions ],
    );

    const value = useMemo(
        () => ({
            state: {
                usernameForProfile,
                userSubmissions,
                userByContestSubmissions,
                userSubmissionsLoading,
                menuItems: selectMenuItems,
            },
            actions: {
                initiateUserSubmissionsForProfileQuery,
                initiateSubmissionsByContestForProfileQuery,
                getDecodedUsernameFromProfile,
                setUsernameForProfile,
            },
        }),
        [
            userSubmissions,
            usernameForProfile,
            userByContestSubmissions,
            userSubmissionsLoading,
            setUsernameForProfile,
            initiateUserSubmissionsForProfileQuery,
            initiateSubmissionsByContestForProfileQuery,
            selectMenuItems,
            getDecodedUsernameFromProfile,
        ],
    );

    return (
        <ProfileSubmissionsContext.Provider value={value}>
            {children}
        </ProfileSubmissionsContext.Provider>
    );
};

const useUserProfileSubmissions = () => useContext(ProfileSubmissionsContext);

export default ProfileSubmissionsProvider;

export {
    useUserProfileSubmissions,
};
