/* eslint-disable */
import React, {useCallback, useMemo, useState} from 'react';
import { useEffect } from 'react';
import styles from './ProfileSubmissions.module.scss';
import {InputLabel, MenuItem, Select} from "@mui/material";
import {IKeyValuePair} from "../../../common/common-types";
import isNil from "lodash/isNil";
import Heading, {HeadingType} from "../../guidelines/headings/Heading";
import {flexCenterObjectStyles} from "../../../utils/object-utils";
import SpinningLoader from "../../guidelines/spinning-loader/SpinningLoader";
import List from "../../guidelines/lists/List";
import isEmpty from "lodash/isEmpty";
import {ISubmissionResponseModel} from "../../../common/types";
import SubmissionGridRow from "../../submissions/submission-grid-row/SubmissionGridRow";
import PaginationControls from "../../guidelines/pagination/PaginationControls";
import Button, {ButtonSize, ButtonType} from "../../guidelines/buttons/Button";
import {usePages} from "../../../hooks/use-pages";
import {useUserProfileSubmissions} from "../../../hooks/submissions/use-profile-submissions";

const defaultState = {
    state: {
        selectValue: { key: '', value: '' },
        initialPage: 1,
    },
};

const ProfileSubmissions = () => {
    const {
        state: { usernameForProfile,
            userSubmissions,
            userByContestSubmissions,
            userSubmissionsLoading,
            userSubmissionsByContestLoading,
            menuItems},
        actions: { initiateUserSubmissionsForProfileQuery,
            initiateSubmissionsByContestForProfileQuery,
        getDecodedUsernameFromProfile},
    } = useUserProfileSubmissions();

    const {
        state: { pagesInfo },
        clearPageValue,
    } = usePages();

    const [ selectValue, setSelectValue ] = useState<IKeyValuePair<string>>(defaultState.state.selectValue);
    const [ submissionsPage, setSubmissionsPage ] = useState(defaultState.state.initialPage);

    useEffect(() => {
        if (isEmpty(usernameForProfile)){
            return;
        }

        initiateUserSubmissionsForProfileQuery(getDecodedUsernameFromProfile(), defaultState.state.initialPage);
    }, [ ]);

    useEffect(() => {
        if (isEmpty(usernameForProfile)){
            return;
        }

        if(!isEmpty(selectValue.key)){
            return;
        }

        initiateUserSubmissionsForProfileQuery(getDecodedUsernameFromProfile(), submissionsPage);
    }, [ submissionsPage, usernameForProfile, selectValue.key ]);

    useEffect(() => {
        if(isEmpty(selectValue.key)) {
            return;
        }

        initiateSubmissionsByContestForProfileQuery(getDecodedUsernameFromProfile(), submissionsPage, selectValue.key);
    }, [ selectValue, submissionsPage ]);

    const handlePageChange = useCallback((newPage: number) => {
        setSubmissionsPage(newPage);
    }, []);


    const handleMenuItemSelection = useCallback(
        (value: string) => {
            const item = menuItems.find((i) => i.value === value) as IKeyValuePair<string>;
            setSubmissionsPage(defaultState.state.initialPage);

            if (isNil(item)) {
                clearPageValue();
                setSelectValue(defaultState.state.selectValue);
                setSubmissionsPage(defaultState.state.initialPage);

                return;
            }

            setSelectValue(item);
        },
        [ menuItems ],
    );

    const renderSubmissionsDropdown = useCallback(
        () => (
            <div>
                <InputLabel id="contest-submissions-label">Choose Contest</InputLabel>
                <Select
                    sx={{
                        width: 350,
                        height: 40,
                        border: '2px solid #42abf8',
                        borderRadius: 2,
                        transition: 'all .2s ease-in-out',
                    }}
                    defaultValue=""
                    labelId="contest-submissions-label"
                    autoWidth
                    displayEmpty
                    value={selectValue.value}
                    onChange={(e) => handleMenuItemSelection(e.target.value)}
                >
                    <MenuItem key="contest-submissions-item-default" value="">Select contest</MenuItem>
                    {menuItems.map((item: IKeyValuePair<string>) => (
                        <MenuItem
                            key={`contest-submissions-item-${item.key}`}
                            value={item.value}
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
            <SubmissionGridRow
                submission={submission}
                shouldDisplayUsername={false}
            />
        ),
        [],
    );

    const currentSubmissions = useMemo(
        () => isEmpty(selectValue.key)
            ? userSubmissions
            : userByContestSubmissions,
        [ userByContestSubmissions, userSubmissions, selectValue ],
    );

    const handleClearFiltersClick = () => {
        setSelectValue(defaultState.state.selectValue);
        clearPageValue();
        setSubmissionsPage(defaultState.state.initialPage);
        initiateUserSubmissionsForProfileQuery(getDecodedUsernameFromProfile(), defaultState.state.initialPage);
    };

    const renderSubmissionsList = useCallback(
        () => {
            if (userSubmissionsLoading || userSubmissionsByContestLoading) {
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
                <>
                    <PaginationControls
                        count={pagesInfo.pagesCount}
                        page={submissionsPage}
                        onChange={handlePageChange}
                    />
                    <List
                        values={currentSubmissions}
                        itemFunc={renderSubmissionRow}
                        itemClassName={styles.submissionRow}
                    />
                </>
            );
        },
        [
            currentSubmissions,
            userSubmissions,
            userByContestSubmissions,
            userSubmissionsLoading,
            renderSubmissionRow,
        ],
    );

    return (
        <>
            <Heading type={HeadingType.primary}>Submissions:</Heading>
            <div className={styles.filtersContainer}>
                {renderSubmissionsDropdown()}
                <div className={styles.clearFiltersBtn}>
                    <Button
                        type={ButtonType.secondary}
                        onClick={() => handleClearFiltersClick()}
                        className={styles.button}
                        text="clear contest filter"
                        size={ButtonSize.small}
                    />
                </div>
            </div>
                {renderSubmissionsList()}
        </>
    );
};

export default ProfileSubmissions;
