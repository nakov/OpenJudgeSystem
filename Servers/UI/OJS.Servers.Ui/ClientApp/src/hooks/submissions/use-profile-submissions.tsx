import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { IKeyValuePair } from '../../common/common-types';
import { IPage, IPagedResultType, IPublicSubmission } from '../../common/types';
import {
    IGetUserSubmissionsForProfileByContestUrlParams,
    IGetUserSubmissionsUrlParams,
    IUserInfoUrlParams,
} from '../../common/url-types';
import { IHaveChildrenProps } from '../../components/common/Props';
import { IAuthorizationReduxState } from '../../redux/features/authorizationSlice';
import isNilOrEmpty from '../../utils/check-utils';
import {
    decodeFromUrlParam,
    getAllParticipationsForUserUrl,
    getSubmissionsForProfileByContestUrl,
    getSubmissionsForProfileUrl,
} from '../../utils/urls';
import { useHttp } from '../use-http';
import { usePages } from '../use-pages';
import { IParticipationType } from '../use-participations';

interface IProfileSubmissionsContext {
    state: {
        usernameForProfile : string;
        userSubmissions: IPublicSubmission[];
        userSubmissionsLoading: boolean;
        userSubmissionsByContestLoading: boolean;
        userByContestSubmissions: IPublicSubmission[];
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
        userSubmissions: [] as IPublicSubmission[],
        userByContestSubmissions: [] as IPublicSubmission[],
        submissionsByContestParams: { username: '', page: 1, contestId: '' },
        menuItems: [] as IKeyValuePair<string>[],
    },
};

const ProfileSubmissionsContext = createContext<IProfileSubmissionsContext>(defaultState as IProfileSubmissionsContext);
type IProfileSubmissionsProviderProps = IHaveChildrenProps
const ProfileSubmissionsProvider = ({ children }: IProfileSubmissionsProviderProps) => {
    const [ usernameForProfile, setUsernameForProfile ] = useState(defaultState.state.usernameForProfile);
    const [ selectMenuItems, setSelectMenuItems ] = useState<IKeyValuePair<string>[]>(defaultState.state.menuItems);
    const [ userSubmissions,
        setUserSubmissions,
    ] = useState<IPublicSubmission[]>(defaultState.state.userSubmissions);
    const [
        userByContestSubmissions,
        setUserByContestSubmissions,
    ] = useState<IPublicSubmission[]>(defaultState.state.userByContestSubmissions);
    const [
        userSubmissionsForProfileUrlParams,
        setUserSubmissionsForProfileUrlParams,
    ] = useState<IGetUserSubmissionsUrlParams | null>(null);
    const [
        submissionsByContestIdParams,
        setSubmissionsByContestIdParams,
    ] = useState<IGetUserSubmissionsForProfileByContestUrlParams | null>(defaultState.state.submissionsByContestParams);
    const [ getParticipationsForProfileUrlParam,
        setParticipationsForProfileUrlParam ] =
        useState<IUserInfoUrlParams | null>();

    const { internalUser: user } =
        useSelector((reduxState: {authorization: IAuthorizationReduxState}) => reduxState.authorization);
    const location = useLocation();
    const { pathname } = location;
    const { populatePageInformation } = usePages();

    const {
        isLoading: userSubmissionsLoading,
        get: getUserSubmissions,
        data: userSubmissionsData,
    } = useHttp<
        IGetUserSubmissionsUrlParams,
        IPagedResultType<IPublicSubmission>>({
            url: getSubmissionsForProfileUrl,
            parameters: userSubmissionsForProfileUrlParams,
        });

    const {
        isLoading: userSubmissionsByContestLoading,
        get: getUserByContestSubmissions,
        data: userByContestSubmissionsData,
    } = useHttp<
        IGetUserSubmissionsForProfileByContestUrlParams,
        IPagedResultType<IPublicSubmission>>({
            url: getSubmissionsForProfileByContestUrl,
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
        () => decodeFromUrlParam(usernameForProfile),
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
            queryResult: IPagedResultType<IPublicSubmission>,
            handleSetData: (submissions: IPublicSubmission[]) => void,
        ) => {
            const newSubmissionsData = queryResult.items as IPublicSubmission[];
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
                const decodedUsername = decodeFromUrlParam(pathSegments[1]);
                setParticipationsForProfileUrlParam({ username: decodedUsername });
                return;
            }

            const { userName } = user;
            setParticipationsForProfileUrlParam({ username: userName });
        },
        [ getUserParticipations, user, userSubmissionsData, getParticipationsForProfileUrlParam, pathname ],
    );

    useEffect(
        () => {
            if (isNil(getParticipationsForProfileUrlParam) || !isNil(userParticipationsData)) {
                return;
            }

            (async () => {
                await getUserParticipations();
            })();
        },
        [ getParticipationsForProfileUrlParam, getUserParticipations, userParticipationsData ],
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
                userSubmissionsByContestLoading,
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
            userSubmissionsByContestLoading,
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
