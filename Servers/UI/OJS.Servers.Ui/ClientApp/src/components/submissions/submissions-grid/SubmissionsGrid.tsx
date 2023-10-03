import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { InputLabel, MenuItem, Select } from '@mui/material';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import { IDictionary, IKeyValuePair } from '../../../common/common-types';
import { useUrlParams } from '../../../hooks/common/use-url-params';
import { ISubmissionResponseModel, usePublicSubmissions } from '../../../hooks/submissions/use-public-submissions';
import { useAuth } from '../../../hooks/use-auth';
import { usePages } from '../../../hooks/use-pages';
import { format } from '../../../utils/number-utils';
import { flexCenterObjectStyles } from '../../../utils/object-utils';
import Button from '../../guidelines/buttons/Button';
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

enum stringQueryNames {
    contestIdParamName ='contestid',
    mySubmissionsParamName = 'my',
    allSubmissionsParamName= 'all',
    toggleValue = 'toggle',
}

const defaultState = {
    state: {
        selectValue: { key: '', value: '' },
        selectedActive: 1,
    },
};

const SubmissionsGrid = () => {
    const [ selectValue, setSelectValue ] = useState<IKeyValuePair<string>>(defaultState.state.selectValue);
    const [ selectedActive, setSelectedActive ] = useState<number>(defaultState.state.selectedActive);
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
            menuItems,
        },
        actions: {
            initiatePublicSubmissionsQuery,
            initiateUnprocessedSubmissionsQuery,
            initiatePendingSubmissionsQuery,
            initiateUserSubmissionsQuery,
            initiateSubmissionsByContestQuery,
            clearPageValues,
        },
    } = usePublicSubmissions();
    const { state: { user } } = useAuth();
    const {
        state: { params: urlParams },
        actions: { setParam, unsetParam },
    } = useUrlParams();
    const {
        state: { currentPage, pagesInfo },
        changePage,
    } = usePages();

    const contestIdParam = useMemo(
        () => urlParams.find((urlParam) => urlParam.key === stringQueryNames.contestIdParamName)?.value as string,
        [ urlParams ],
    );

    const toggleParam = useMemo(
        () => urlParams.find((urlParam) => urlParam.key === stringQueryNames.toggleValue)?.value,
        [ urlParams ],
    );

    const [ activeToggleElement, setActiveToggleElement ] = useState<toggleValues>(!toggleParam
        ? toggleValues.allSubmissions
        : toggleParam === stringQueryNames.mySubmissionsParamName
            ? toggleValues.mySubmissions
            : toggleValues.allSubmissions);

    const selectedSubmissionStateToRequestMapping = useMemo(
        () => ({
            1: initiatePublicSubmissionsQuery,
            2: initiateUnprocessedSubmissionsQuery,
            3: initiatePendingSubmissionsQuery,
        } as IDictionary<() => void>),
        [ initiatePendingSubmissionsQuery, initiatePublicSubmissionsQuery, initiateUnprocessedSubmissionsQuery ],
    );

    useEffect(() => {
        if (activeToggleElement === toggleValues.mySubmissions && isNil(contestIdParam)) {
            initiateUserSubmissionsQuery();
        }
    }, [ activeToggleElement, initiateUserSubmissionsQuery, contestIdParam ]);

    useEffect(
        () => {
            if (isEmpty(menuItems)) {
                return;
            }

            if (isNil(contestIdParam)) {
                return;
            }

            const selectedMenuItem = menuItems.find((mi) => mi.key === contestIdParam) as IKeyValuePair<string>;

            setSelectValue(selectedMenuItem);
            initiateSubmissionsByContestQuery(contestIdParam);
        },
        [ contestIdParam, currentPage, initiateSubmissionsByContestQuery, menuItems ],
    );

    const handlePageChange = useCallback(
        (page: number) => changePage(page),
        [ changePage ],
    );

    const handleSelectSubmissionType = useCallback(
        (typeKey: number) => {
            if (selectedActive) {
                clearPageValues();

                setSelectedActive(typeKey);
            }
        },
        [ clearPageValues, selectedActive ],
    );

    const handleMenuItemSelection = useCallback(
        (item: IKeyValuePair<string>) => {
            clearPageValues();

            setSelectValue(item);
            setParam(stringQueryNames.contestIdParamName, item.key);
        },
        [ clearPageValues, setParam ],
    );

    const handleToggleClick = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            const clickedElement = e.target as HTMLButtonElement;
            const { textContent } = clickedElement;

            if (textContent?.toLowerCase() === toggleValues.allSubmissions) {
                setActiveToggleElement(toggleValues.allSubmissions);
                setParam(stringQueryNames.toggleValue, stringQueryNames.allSubmissionsParamName);
            } else {
                setActiveToggleElement(toggleValues.mySubmissions);
                setParam(stringQueryNames.toggleValue, stringQueryNames.mySubmissionsParamName);
            }

            setSelectValue(defaultState.state.selectValue);

            unsetParam(stringQueryNames.contestIdParamName);
            clearPageValues();
        },
        [ unsetParam, clearPageValues, setParam ],
    );

    useEffect(
        () => {
            if (activeToggleElement === toggleValues.mySubmissions || contestIdParam) {
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

    const getCurrentAllSubmissions = useMemo(
        () => {
            if (selectedActive === 1) {
                return publicSubmissions;
            } if (selectedActive === 2) {
                return unprocessedSubmissions;
            }
            return pendingSubmissions;
        },
        [ pendingSubmissions, publicSubmissions, selectedActive, unprocessedSubmissions ],
    );

    const getCurrentMySubmissions = useMemo(
        () => contestIdParam
            ? userByContestSubmissions
            : userSubmissions,
        [ contestIdParam, userByContestSubmissions, userSubmissions ],
    );

    const { pagesCount } = pagesInfo;
    const renderPrivilegedComponent = useCallback(
        () => {
            const { isInRole } = user;
            const toggleSubmissions = activeToggleElement === toggleValues.allSubmissions
                ? getCurrentAllSubmissions.length
                : getCurrentMySubmissions.length;

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
                    { ((isInRole || activeToggleElement === toggleValues.mySubmissions) && toggleSubmissions > 0) && (
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
            getCurrentAllSubmissions,
            getCurrentMySubmissions,
        ],
    );

    const renderToggleButton = useCallback(() => (
        <div className={styles.toggleButtonWrapper}>
            <Button
              internalClassName={`${activeToggleElement === toggleValues.allSubmissions
                  ? styles.activeElement
                  : styles.unActiveElement}`}
              onClick={(e) => handleToggleClick(e)}
            >
                ALL SUBMISSIONS
            </Button>
            <Button
              internalClassName={`${activeToggleElement === toggleValues.mySubmissions
                  ? styles.activeElement
                  : styles.unActiveElement}`}
              onClick={(e) => handleToggleClick(e)}
            >
                MY SUBMISSIONS
            </Button>
        </div>
    ), [ activeToggleElement, handleToggleClick ]);

    const renderSubmissionsDropdown = useCallback(
        () => (
            <div style={{ marginTop: 15 }}>
                <InputLabel id="contest-submissions-label">Choose Contest</InputLabel>
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
                    {menuItems.map((item: IKeyValuePair<string>) => (
                        <MenuItem
                          key={`contest-submissions-item-${item.key}`}
                          value={item.value}
                          onClick={() => handleMenuItemSelection(item)}
                        >
                            {item.value}
                        </MenuItem>
                    ))}
                </Select>
            </div>
        ),
        [ selectValue, menuItems, handleMenuItemSelection ],
    );

    const renderSubmissionRow = useCallback(
        (submission: ISubmissionResponseModel) => (
            <SubmissionGridRow submission={submission} />
        ),
        [],
    );

    const currentSubmissions = useMemo(
        () => activeToggleElement === toggleValues.allSubmissions
            ? getCurrentAllSubmissions
            : contestIdParam
                ? userByContestSubmissions
                : userSubmissions,
        [ activeToggleElement, contestIdParam, getCurrentAllSubmissions, userByContestSubmissions, userSubmissions ],
    );

    const renderSubmissionsList = useCallback(
        () => {
            if (activeToggleElement === toggleValues.mySubmissions && userSubmissionsLoading) {
                return (
                    <div style={{ ...flexCenterObjectStyles, marginTop: '10px' }}>
                        <SpinningLoader />
                    </div>
                );
            }

            if (currentSubmissions.length === 0) {
                return (
                    <div className={styles.noSubmissionsFound}>
                        No submissions found.
                    </div>
                );
            }

            return (
                <List
                  values={currentSubmissions}
                  itemFunc={renderSubmissionRow}
                  itemClassName={styles.submissionRow}
                  fullWidth
                />
            );
        },
        [
            currentSubmissions,
            activeToggleElement,
            userSubmissionsLoading,
            renderSubmissionRow,
        ],
    );

    return (
        <>
            <Heading type={HeadingType.primary}>
                Latest
                {' '}
                {currentSubmissions.length}
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
