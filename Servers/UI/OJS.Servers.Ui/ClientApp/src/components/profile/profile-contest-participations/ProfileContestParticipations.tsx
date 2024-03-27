// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { SortType } from '../../../common/contest-types';
import { IGetContestParticipationsForUserQueryParams, IIndexContestsType } from '../../../common/types';
import {
    setProfileUserContestParticipationsPage,
    setUserContestParticipations,
} from '../../../redux/features/contestsSlice';
import { useGetContestsParticipationsForUserQuery } from '../../../redux/services/contestsService';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import isNilOrEmpty from '../../../utils/check-utils';
import ContestCard from '../../contests/contest-card/ContestCard';
import List, { Orientation } from '../../guidelines/lists/List';
import PaginationControls from '../../guidelines/pagination/PaginationControls';
import SpinningLoader from '../../guidelines/spinning-loader/SpinningLoader';

const ProfileContestParticipations = () => {
    const { profile } = useAppSelector((reduxState) => reduxState.users);
    const {
        userContestParticipations,
        profileUserContestParticipationsPage,
    } = useAppSelector((reduxState) => reduxState.contests);

    const dispatch = useAppDispatch();

    const {
        data: contestsParticipations,
        isLoading: areContestParticipationsLoading,
    } = useGetContestsParticipationsForUserQuery(
        {
            username: profile?.userName,
            sortType: SortType.OrderBy,
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

    const renderContestCard = (contest: IIndexContestsType) => (<ContestCard contest={contest} />);

    return areContestParticipationsLoading
        ? (<SpinningLoader />)
        : !isNilOrEmpty(userContestParticipations.items)
            ? (
                <div>
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
            : <span>No participations in contests yet</span>;
};

export default ProfileContestParticipations;
