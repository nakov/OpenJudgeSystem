// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useEffect } from 'react';
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
import isNilOrEmpty from '../../../utils/check-utils';
import concatClassNames from '../../../utils/class-names';
import ContestCard from '../../contests/contest-card/ContestCard';
import List, { Orientation } from '../../guidelines/lists/List';
import PaginationControls from '../../guidelines/pagination/PaginationControls';
import SpinningLoader from '../../guidelines/spinning-loader/SpinningLoader';

import styles from './ProfileContestParticipations.module.scss';

interface IProfileContestParticipationsProps {
    userIsProfileOwner: boolean;
}

const ProfileContestParticipations = ({ userIsProfileOwner }: IProfileContestParticipationsProps) => {
    const { internalUser } = useAppSelector((reduxState) => reduxState.authorization);
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
        { skip: isNil(profile) },
    );

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
        : !isNilOrEmpty(userContestParticipations.items)
            ? (
                <div>
                    {/* If user is not owner and has no rights, */}
                    {/* he wont see the submissions/contests toggle
                    {/* but should be able to see user participations, */}
                    {/* so this heading should get rendered */}
                    { !userIsProfileOwner && !internalUser.canAccessAdministration &&
                        <h2 className={styles.participationsHeading}>Participated in:</h2>}
                    <List
                      values={userContestParticipations.items!}
                      itemFunc={renderContestCard}
                      orientation={Orientation.vertical}
                      fullWidth
                    />
                    {!isEmpty(userContestParticipations) && userContestParticipations.pagesCount !== 0 && (
                        <PaginationControls
                          count={userContestParticipations.pagesCount}
                          page={userContestParticipations.pageNumber}
                          onChange={onPageChange}
                        />
                    )}
                </div>
            )
            : (
                <div className={concatClassNames(
                    styles.noParticipationsText,
                    getColorClassName(themeColors.textColor),
                )}
                >
                    No participations in contests yet
                </div>
            );
};

export default ProfileContestParticipations;
