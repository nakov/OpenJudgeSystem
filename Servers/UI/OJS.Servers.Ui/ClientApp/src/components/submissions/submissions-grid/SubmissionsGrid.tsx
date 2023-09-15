import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { InputLabel, MenuItem, Select } from '@mui/material';

import { IDictionary, IKeyValuePair } from '../../../common/common-types';
import { useUrlParams } from '../../../hooks/common/use-url-params';
import { ISubmissionResponseModel, usePublicSubmissions } from '../../../hooks/submissions/use-public-submissions';
import { useAuth } from '../../../hooks/use-auth';
import { useHttp } from '../../../hooks/use-http';
import { usePages } from '../../../hooks/use-pages';
import { IParticipationType } from '../../../hooks/use-participations';
import { format } from '../../../utils/number-utils';
import { flexCenterObjectStyles } from '../../../utils/object-utils';
import { getAllParticipationsForUserUrl } from '../../../utils/urls';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import List from '../../guidelines/lists/List';
import PaginationControls from '../../guidelines/pagination/PaginationControls';
import SpinningLoader from '../../guidelines/spinning-loader/SpinningLoader';
import SubmissionGridRow from '../submission-grid-row/SubmissionGridRow';

import SubmissionStateLink from './SubmissionStateLink';

import styles from './SubmissionsGrid.module.scss';

const selectedSubmissionsStateMapping = {
    1: 'All',
    2: 'In Queue',
    3: 'Pending',
} as IDictionary<string>;

enum toggleValues {
    allSubmissions = 'all submissions',
    mySubmissions = 'my submissions',
}

const SubmissionsGrid = () => {
    const { state: { params: urlParams }, actions: { setParam } } = useUrlParams();
    const toggleParam = urlParams.find((urlParam) => urlParam.key === 'toggle')?.value;
    const contestIdParam = urlParams.find((urlParam) => urlParam.key === 'contestid')?.value;

    const [ selectValue, setSelectValue ] = useState<IKeyValuePair<string>>({ key: '', value: '' });
    const [ selectMenuItems, setSelectMenuItems ] = useState<IKeyValuePair<string>[]>();
    const [ selectedActive, setSelectedActive ] = useState<number>(1);
    const [ activeToggleElement, setActiveToggleElement ] = useState<toggleValues>(!toggleParam
        ? toggleValues.allSubmissions
        : toggleParam === 'my'
            ? toggleValues.mySubmissions
            : toggleValues.allSubmissions);

    const {
        state: {
            userSubmissions,
            userSubmissionsLoading,
            publicSubmissions,
            unprocessedSubmissions,
            pendingSubmissions,
            totalSubmissionsCount,
            totalUnprocessedSubmissionsCount,
            userByContestSubmissions,
        },
        actions: {
            initiatePublicSubmissionsQuery,
            initiateUnprocessedSubmissionsQuery,
            initiatePendingSubmissionsQuery,
            initiateUserSubmissionsQuery,
            initiateSubmissionsByContestQuery,
        },
    } = usePublicSubmissions();

    const {
        get: getUserParticipations,
        data: userParticipationsData,
    } = useHttp<null, IParticipationType[]>({ url: getAllParticipationsForUserUrl });

    const { state: { user } } = useAuth();

    const selectedSubmissionStateToRequestMapping = useMemo(
        () => ({
            1: initiatePublicSubmissionsQuery,
            2: initiateUnprocessedSubmissionsQuery,
            3: initiatePendingSubmissionsQuery,
        } as IDictionary<() => void>),
        [ initiatePendingSubmissionsQuery, initiatePublicSubmissionsQuery, initiateUnprocessedSubmissionsQuery ],
    );

    const {
        state: { currentPage, pagesInfo },
        changePage,
        clearPageValue,
    } = usePages();

    useEffect(() => {
        console.log('userByContestSubmissions => ', userByContestSubmissions);
    }, [ userByContestSubmissions ]);

    useEffect(() => {
        setParam('contestid', selectValue.value);
        if (!selectValue.value) {
            return;
        }
        initiateSubmissionsByContestQuery();
    }, [ selectValue, setParam, initiateSubmissionsByContestQuery ]);

    useEffect(() => {
        getUserParticipations();
    }, [ getUserParticipations ]);

    useEffect(() => {
        const mappedMenuItems = (userParticipationsData || []).map((item: IParticipationType) => ({
            key: item.contestName,
            value: item.id.toString(),
        }));
        setSelectMenuItems(mappedMenuItems);
    }, [ userParticipationsData ]);

    useEffect(() => {
        if (activeToggleElement === toggleValues.mySubmissions && !contestIdParam) {
            initiateUserSubmissionsQuery();
        }
    }, [ activeToggleElement, initiateUserSubmissionsQuery, contestIdParam ]);

    const handlePageChange = useCallback(
        (page: number) => changePage(page),
        [ changePage ],
    );

    const renderSubmissionRow = useCallback(
        (submission: ISubmissionResponseModel) => (
            <SubmissionGridRow submission={submission} />
        ),
        [],
    );

    const handleSelectSubmissionType = useCallback((typeKey: number) => {
        if (selectedActive) {
            clearPageValue();

            setSelectedActive(typeKey);
        }
    }, [ clearPageValue, selectedActive ]);

    const handleToggleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        const clickedElement = e.target as HTMLButtonElement;
        const { textContent } = clickedElement;

        if (textContent?.toLowerCase() === toggleValues.allSubmissions) {
            setActiveToggleElement(toggleValues.allSubmissions);
            setParam('toggle', 'all');
        } else {
            setActiveToggleElement(toggleValues.mySubmissions);
            setParam('toggle', 'my');
        }

        setSelectValue({ key: '', value: '' });
        changePage(1);
    }, [ changePage, setParam, setSelectValue ]);

    useEffect(
        () => {
            if ((totalSubmissionsCount === 0 || activeToggleElement === toggleValues.mySubmissions) && contestIdParam) {
                return;
            }

            selectedSubmissionStateToRequestMapping[selectedActive]();
        },
        [
            contestIdParam,
            activeToggleElement,
            initiatePendingSubmissionsQuery,
            initiatePublicSubmissionsQuery,
            initiateUnprocessedSubmissionsQuery,
            selectedActive,
            selectedSubmissionStateToRequestMapping,
            totalSubmissionsCount,
        ],
    );

    const { pagesCount } = pagesInfo;
    const renderPrivilegedComponent = useCallback(
        () => {
            const { isInRole } = user;
            const toggleSubmissions = activeToggleElement === toggleValues.allSubmissions
                ? publicSubmissions
                : userSubmissions;

            return (
                <>
                    { (isInRole && activeToggleElement === toggleValues.allSubmissions) && (
                        <Heading type={HeadingType.secondary}>
                            Submissions awaiting execution:
                            {' '}
                            {totalUnprocessedSubmissionsCount}
                            {' '}
                            (
                            <SubmissionStateLink
                              stateIndex={1}
                              isSelected={selectedActive === 1}
                              text={selectedSubmissionsStateMapping[1]}
                              handleOnSelect={handleSelectSubmissionType}
                            />
                            /
                            <SubmissionStateLink
                              stateIndex={2}
                              isSelected={selectedActive === 2}
                              text={selectedSubmissionsStateMapping[2]}
                              handleOnSelect={handleSelectSubmissionType}
                            />
                            /
                            <SubmissionStateLink
                              stateIndex={3}
                              isSelected={selectedActive === 3}
                              text={selectedSubmissionsStateMapping[3]}
                              handleOnSelect={handleSelectSubmissionType}
                            />
                            )
                        </Heading>
                    )}
                    { ((isInRole || activeToggleElement === toggleValues.mySubmissions) && toggleSubmissions?.length > 0) && (
                    <PaginationControls
                      count={pagesCount}
                      page={currentPage}
                      onChange={handlePageChange}
                    />
                    ) }
                </>
            );
        },
        [
            user,
            totalUnprocessedSubmissionsCount,
            selectedActive,
            handleSelectSubmissionType,
            pagesCount,
            currentPage,
            handlePageChange,
            activeToggleElement,
            publicSubmissions,
            userSubmissions,
        ],
    );

    const renderToggleButton = useCallback(() => (
        <div className={styles.toggleButtonWrapper}>
            <button
              type="button"
              className={`${activeToggleElement === toggleValues.allSubmissions
                  ? styles.activeElement
                  : ''}`}
              onClick={(e) => handleToggleClick(e)}
            >
                ALL SUBMISSIONS
            </button>
            <button
              type="button"
              className={`${activeToggleElement === toggleValues.mySubmissions
                  ? styles.activeElement
                  : ''}`}
              onClick={(e) => handleToggleClick(e)}
            >
                MY SUBMISSIONS
            </button>
        </div>
    ), [ activeToggleElement, handleToggleClick ]);

    const renderSubmissionsDropdown = useCallback(() => (
        <div style={{ marginTop: 15 }}>
            <InputLabel id="contest-submissions-label">Contest Submissions</InputLabel>
            <Select
              sx={{
                  width: 350,
                  height: 40,
                  border: '2px solid #42abf8',
                  borderRadius: 2,
                  transition: 'all .2s ease-in-out',
                  '&& fieldset': { border: 'none' },
                  '&:hover': { backgroundColor: '#e3f3fd' },
              }}
              defaultValue=""
              labelId="contest-submissions-label"
              autoWidth
              displayEmpty
              value={selectValue.value}
            >
                <MenuItem key="contest-submissions-item-default" value="">Select contest</MenuItem>
                {selectMenuItems?.map((item: IKeyValuePair<string>) => (
                    <MenuItem
                      key={`contest-submissions-item-${item.value}`}
                      value={item.value}
                      onClick={() => setSelectValue(item)}
                    >
                        {item.key}
                    </MenuItem>
                ))}
            </Select>
        </div>
    ), [ selectValue, selectMenuItems ]);

    const renderSubmissionsList = useCallback(
        () => {
            const toggleSubmissions = activeToggleElement === toggleValues.allSubmissions
                ? publicSubmissions
                : userSubmissions;

            const submissions = selectedActive === 1
                ? toggleSubmissions
                : selectedActive === 2
                    ? unprocessedSubmissions
                    : pendingSubmissions;

            if (activeToggleElement === toggleValues.mySubmissions && userSubmissionsLoading) {
                return (
                    <div style={{ ...flexCenterObjectStyles, marginTop: '10px' }}>
                        <SpinningLoader />
                    </div>
                );
            }

            if (!submissions || submissions?.length === 0) {
                return (
                    <div className={styles.noSubmissionsFound}>
                        No submissions found.
                    </div>
                );
            }

            return (
                <List
                  values={submissions || []}
                  itemFunc={renderSubmissionRow}
                  itemClassName={styles.submissionRow}
                  fullWidth
                />
            );
        },
        [
            activeToggleElement,
            publicSubmissions,
            userSubmissions,
            selectedActive,
            unprocessedSubmissions,
            pendingSubmissions,
            userSubmissionsLoading,
            renderSubmissionRow,
        ],
    );

    return (
        <>
            <Heading type={HeadingType.primary}>
                Latest
                {' '}
                {publicSubmissions?.length}
                {' '}
                submissions out of
                {' '}
                {format(totalSubmissionsCount)}
                {' '}
                total
            </Heading>
            <div className={styles.filtersContainer}>
                {user.email && renderToggleButton()}
                {activeToggleElement === toggleValues.mySubmissions && renderSubmissionsDropdown()}
            </div>
            {renderPrivilegedComponent()}
            {renderSubmissionsList()}
        </>
    );
};

export default SubmissionsGrid;
