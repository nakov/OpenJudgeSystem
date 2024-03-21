import React, { useEffect } from 'react';
import isNil from 'lodash/isNil';

import { setCurrentPage, setProfileSubmissions } from '../../../redux/features/submissionsSlice';
import { useGetUserSubmissionsQuery } from '../../../redux/services/submissionsService';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { flexCenterObjectStyles } from '../../../utils/object-utils';
import SpinningLoader from '../../guidelines/spinning-loader/SpinningLoader';
import SubmissionsGrid from '../../submissions/submissions-grid/SubmissionsGrid';

const ProfileSubmissions = () => {
    const dispatch = useAppDispatch();

    const { profile } = useAppSelector((state) => state.users);

    const {
        profileSubmissions,
        currentPage,
    } = useAppSelector((state) => state.submissions);

    const {
        data: userSubmissions,
        isLoading: userSubmissionsLoading,
    } = useGetUserSubmissionsQuery({
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        username: profile?.userName!,
        page: currentPage,
    }, { skip: isNil(profile) });

    useEffect(() => {
        if (!isNil(userSubmissions)) {
            dispatch(setProfileSubmissions(userSubmissions));
        }
    }, [ dispatch, userSubmissions ]);

    return (
        userSubmissionsLoading
            ? (
                <div style={{ ...flexCenterObjectStyles, marginTop: '10px' }}>
                    <SpinningLoader />
                </div>
            )
            : (
                <SubmissionsGrid
                  isDataLoaded={!userSubmissionsLoading}
                  submissions={profileSubmissions}
                  handlePageChange={(page: number) => dispatch(setCurrentPage(page))}
                  options={{
                      showTaskDetails: true,
                      showDetailedResults: true,
                      showCompeteMarker: false,
                      showSubmissionTypeInfo: false,
                      showParticipantUsername: false,
                  }}
                />
            )
    );
};

export default ProfileSubmissions;
