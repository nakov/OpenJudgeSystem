// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useEffect, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { SortType, SortTypeDirection } from '../../../common/contest-types';
import { IGetContestParticipationsForUserQueryParams, IIndexContestsType } from '../../../common/types';
import useTheme from '../../../hooks/use-theme';
import {
    setProfileUserContestParticipationsPage,
    setUserContestParticipations,
} from '../../../redux/features/contestsSlice';
import { useGetContestsParticipationsForUserQuery } from '../../../redux/services/contestsService';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import concatClassNames from '../../../utils/class-names';
import ContestCard from '../../contests/contest-card/ContestCard';
import List, { Orientation } from '../../guidelines/lists/List';
import PaginationControls from '../../guidelines/pagination/PaginationControls';
import SpinningLoader from '../../guidelines/spinning-loader/SpinningLoader';

import styles from './ProfileContestParticipations.module.scss';

interface IProfileContestParticipationsProps {
    userIsProfileOwner: boolean;
    isChosenInToggle: boolean;
}

const ProfileContestParticipations = ({ userIsProfileOwner, isChosenInToggle }: IProfileContestParticipationsProps) => {
    const [ shouldSkipFetchData, setShouldSkipFetchData ] = useState<boolean>(true);
    const [ shouldRender, setShouldRender ] = useState<boolean>(false);

    const { internalUser, isLoggedIn } = useAppSelector((reduxState) => reduxState.authorization);
    const { profile } = useAppSelector((reduxState) => reduxState.users);
    const {
        userContestParticipations,
        profileUserContestParticipationsPage,
    } = useAppSelector((reduxState) => reduxState.contests);
    const { getColorClassName, themeColors } = useTheme();

    const dispatch = useAppDispatch();

    const {
        data: contestsParticipations,
        isLoading: areContestParticipationsLoading,
    } = useGetContestsParticipationsForUserQuery(
        {
            username: profile?.userName,
            sortType: SortType.ParticipantRegistrationTime,
            sortTypeDirection: SortTypeDirection.Descending,
            page: profileUserContestParticipationsPage,
        } as IGetContestParticipationsForUserQueryParams,
        { skip: shouldSkipFetchData },
    );

    useEffect(() => {
        if (// If anonymous user but profile is not fetched
            (!isLoggedIn && isNil(profile)) ||
            // If not chosen in toggle and profile is fetched
            (isLoggedIn && !isChosenInToggle && !isNil(profile)) ||
            // Profile is not fetched
            isNil(profile)) {
            setShouldSkipFetchData(true);
            return;
        }

        setShouldSkipFetchData(false);
    }, [ isChosenInToggle, isLoggedIn, profile ]);

    useEffect(() => {
        if (shouldSkipFetchData || areContestParticipationsLoading || isNil(contestsParticipations)) {
            setShouldRender(false);
            return;
        }

        setShouldRender(true);
    }, [ areContestParticipationsLoading, contestsParticipations, isLoggedIn, profile, shouldSkipFetchData ]);

    useEffect(
        () => {
            if (areContestParticipationsLoading || isNil(contestsParticipations)) {
                return;
            }

            dispatch(setUserContestParticipations(contestsParticipations));
        },
        [ areContestParticipationsLoading, contestsParticipations, dispatch ],
    );

    const onPageChange = (page: number) => {
        dispatch(setProfileUserContestParticipationsPage(page));
    };

    const renderContestCard = (contest: IIndexContestsType) => (
        <ContestCard
          contest={contest}
          showPoints={userIsProfileOwner || internalUser.isAdmin}
        />
    );

    return areContestParticipationsLoading
        ? (<SpinningLoader />)
        : shouldRender
            ? (
                <div>
                    { !isEmpty(userContestParticipations.items) && !isLoggedIn &&
                        <h2 className={styles.participationsHeading}>Participated in:</h2>}
                    <List
                      values={userContestParticipations.items!}
                      itemFunc={renderContestCard}
                      orientation={Orientation.vertical}
                      fullWidth
                    />
                    {!isEmpty(userContestParticipations) && userContestParticipations.pagesCount > 1 && (
                        <PaginationControls
                          count={userContestParticipations.pagesCount}
                          page={userContestParticipations.pageNumber}
                          onChange={onPageChange}
                        />
                    )}
                    {isEmpty(userContestParticipations.items) &&
                        (
                            <div className={concatClassNames(
                                styles.noParticipationsText,
                                getColorClassName(themeColors.textColor),
                            )}
                            >
                                No participations in contests yet
                            </div>
                        )}
                </div>
            )
            : null;
};

export default ProfileContestParticipations;
