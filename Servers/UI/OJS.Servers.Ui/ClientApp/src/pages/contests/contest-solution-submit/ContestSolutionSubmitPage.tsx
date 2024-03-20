import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { IoDocumentText } from 'react-icons/io5';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Popover from '@mui/material/Popover';

import { ISubmissionTypeType } from '../../../common/types';
import CodeEditor from '../../../components/code-editor/CodeEditor';
import ContestBreadcrumbs from '../../../components/contests/contest-breadcrumbs/ContestBreadcrumbs';
import ContestProblems from '../../../components/contests/contest-problems/ContestProblems';
import Dropdown from '../../../components/dropdown/Dropdown';
import FileUploader from '../../../components/file-uploader/FileUploader';
import Button from '../../../components/guidelines/buttons/Button';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import SubmissionsGrid from '../../../components/submissions/submissions-grid/SubmissionsGrid';
import useTheme from '../../../hooks/use-theme';
import { setContestDetails } from '../../../redux/features/contestsSlice';
import {
    useGetContestUserParticipationQuery, useLazyGetContestByIdQuery,
    useSubmitContestSolutionMutation,
} from '../../../redux/services/contestsService';
import {
    useLazyGetSubmissionResultsByProblemQuery,
} from '../../../redux/services/submissionsService';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { flexCenterObjectStyles } from '../../../utils/object-utils';

import styles from './ContestSolutionSubmitPage.module.scss';

const ContestSolutionSubmitPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { themeColors, getColorClassName } = useTheme();
    const { contestId, participationType } = useParams();

    const [ selectedStrategyValue, setSelectedStrategyValue ] = useState<string>('');
    const [ selectedSubmissionType, setSelectedSubmissionType ] = useState<ISubmissionTypeType>();
    const [ submissionCode, setSubmissionCode ] = useState<string>();
    const [ anchorEl, setAnchorEl ] = useState<HTMLElement | null>(null);
    const [ submissionsData, setSubmissionsData ] = useState(null);
    const [ submissionsError, setSubmissionsError ] = useState('');
    const [ submissionsDataLoading, setSubmissionsDataLoading ] = useState<boolean>(false);

    const { selectedContestDetailsProblem, contestDetails } = useAppSelector((state) => state.contests);

    const [ submitSolution ] = useSubmitContestSolutionMutation();
    const [ getContestById ] = useLazyGetContestByIdQuery();
    const [ getSubmissionsData ] = useLazyGetSubmissionResultsByProblemQuery();

    const {
        data,
        isLoading,
        error,
    } = useGetContestUserParticipationQuery({ id: Number(contestId), isOfficial: participationType === 'compete' });

    const isModalOpen = Boolean(anchorEl);

    const { contest, shouldEnterPassword, participantsCount } = data || {};
    const { id, name, problems, allowedSubmissionTypes } = contest || {};
    const { memoryLimit, timeLimit, fileSizeLimit, checkerName } = selectedContestDetailsProblem || {};

    const strategyDropdownItems = useMemo(
        () => allowedSubmissionTypes?.map((item: any) => ({ id: item.id, name: item.name })),
        [ allowedSubmissionTypes ],
    );

    const textColorClassName = getColorClassName(themeColors.textColor);
    const darkBackgroundClassName = getColorClassName(themeColors.baseColor500);
    const lightBackgroundClassName = getColorClassName(themeColors.baseColor100);

    const onStrategyDropdownItemSelect = useCallback((s: any) => {
        const submissionType = allowedSubmissionTypes.find((type: ISubmissionTypeType) => type.id === s.id);

        setSelectedStrategyValue(s.id);
        setSelectedSubmissionType(submissionType);
    }, [ allowedSubmissionTypes ]);

    useEffect(() => {
        setSubmissionCode('');
    }, [ selectedContestDetailsProblem ]);

    useEffect(() => {
        if (shouldEnterPassword) {
            navigate('/enter-exam-password');
        }
    }, [ shouldEnterPassword, navigate ]);

    // in case of loading by url we need to have contest details set in state,
    // in order for breadcrumbs to load and work properly
    useEffect(() => {
        if (!contestDetails) {
            const fetchAndSetContestDetails = async () => {
                const { data: contestDetailsData } = await getContestById({ id: Number(contestId) });
                dispatch(setContestDetails({ contest: contestDetailsData ?? null }));
            };

            fetchAndSetContestDetails();
        }
    }, [ contestDetails, contestId, getContestById, dispatch ]);

    // set dropdown data to the first element in the dropdown
    // instead of having the default empty one selected
    useEffect(() => {
        if (strategyDropdownItems?.length > 0) {
            onStrategyDropdownItemSelect(strategyDropdownItems[0]);
        }
    }, [ strategyDropdownItems, onStrategyDropdownItemSelect ]);

    // fetching submissions only when we have selected problem,
    // otherwise the id is NaN and the query is invalid
    useEffect(() => {
        if (selectedContestDetailsProblem) {
            const fetchSubmissionsData = async () => {
                try {
                    setSubmissionsDataLoading(true);
                    const { data: currentSubmissionsData } = await getSubmissionsData({
                        id: Number(selectedContestDetailsProblem.id),
                        page: 1,
                        isOfficial: participationType === 'compete',
                    });

                    setSubmissionsData(currentSubmissionsData);
                    setSubmissionsDataLoading(false);
                } catch {
                    setSubmissionsError('Error loading submissions!');
                    setSubmissionsDataLoading(false);
                }
            };

            fetchSubmissionsData();
        }
    }, [ selectedContestDetailsProblem, participationType, getSubmissionsData ]);

    const onPopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const onPopoverClose = () => {
        setAnchorEl(null);
    };

    const onSolutionSubmit = () => {
        submitSolution({
            content: submissionCode,
            official: participationType === 'compete',
            problemId: selectedContestDetailsProblem?.id,
            submissionTypeId: selectedSubmissionType?.id,
        });
        setSubmissionCode('');
    };

    const renderProblemDescriptions = useCallback(() => {
        if (!selectedContestDetailsProblem) {
            return;
        }
        const { resources } = selectedContestDetailsProblem;
        // eslint-disable-next-line consistent-return
        return (
            <div className={styles.problemDescriptionsWrapper}>
                <div className={styles.problemDescriptions}>
                    { resources.map((resource: any) => {
                        const { link, name: linkName } = resource;
                        return (
                            <Link target="_blank" to={link}>
                                <IoDocumentText />
                                {' '}
                                {linkName}
                            </Link>
                        );
                    })}
                </div>
                <div onMouseEnter={onPopoverOpen} onMouseLeave={onPopoverClose}>
                    <IoIosInformationCircleOutline />
                </div>
                <Popover
                  open={isModalOpen}
                  anchorEl={anchorEl}
                  anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                  }}
                  transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                  }}
                  sx={{ pointerEvents: 'none' }}
                  onClose={onPopoverClose}
                  disableRestoreFocus
                >
                    <div className={`${styles.popoverContent} ${textColorClassName} ${lightBackgroundClassName}`}>
                        <div>
                            <span className={styles.title}>Allowed working time:</span>
                            {' '}
                            <span>{timeLimit}</span>
                            {' '}
                            sec
                        </div>
                        <div>
                            <span className={styles.title}>Allowed memory:</span>
                            {' '}
                            <span>{memoryLimit}</span>
                            {' '}
                            MB
                        </div>
                        <div>
                            <span className={styles.title}>Size limit:</span>
                            {' '}
                            <span>{fileSizeLimit}</span>
                            {' '}
                            KB
                        </div>
                        { checkerName && (
                        <div>
                            <span className={styles.title}>Checker:</span>
                            {' '}
                            { checkerName}
                        </div>
                        )}
                    </div>
                </Popover>
            </div>
        );
    }, [
        selectedContestDetailsProblem,
        anchorEl,
        isModalOpen,
        checkerName,
        fileSizeLimit,
        memoryLimit,
        timeLimit,
        lightBackgroundClassName,
        textColorClassName,
    ]);

    const renderSubmissionsInput = () => {
        const { allowBinaryFilesUpload, allowedFileExtensions } = allowedSubmissionTypes[0] || {};

        if (allowBinaryFilesUpload) {
            return (
                <>
                    <div className={styles.fileUpload}>
                        <div>
                            <span>Allowed extensions:</span>
                            {' '}
                            {allowedFileExtensions.join(', ')}
                        </div>
                        <FileUploader
                          file={null}
                          problemId={id}
                          allowedFileExtensions={allowedFileExtensions}
                          onInvalidFileExtension={() => console.log('error on submit!')}
                        />
                    </div>
                    <Button
                      onClick={onSolutionSubmit}
                      text="Submit"
                    />
                </>
            );
        }

        return (
            <div>
                <CodeEditor
                  selectedSubmissionType={selectedSubmissionType}
                  code={submissionCode}
                  onCodeChange={(inputCode) => setSubmissionCode(inputCode)}
                />
                <div
                  style={{ borderTop: `1px solid ${themeColors.textColor}` }}
                  className={`${styles.participantsWrapper} ${darkBackgroundClassName}`}
                >
                    <span>
                        Total Participants:
                        {' '}
                        {participantsCount}
                    </span>
                </div>
                <div className={styles.submitSettings}>
                    <Dropdown
                      dropdownItems={strategyDropdownItems}
                      value={selectedStrategyValue}
                      handleDropdownItemClick={onStrategyDropdownItemSelect}
                    />
                    <Button
                      onClick={onSolutionSubmit}
                      text="Submit"
                    />
                </div>
            </div>
        );
    };

    if (isLoading) {
        return <div style={{ ...flexCenterObjectStyles }}><SpinningLoader /></div>;
    }
    if (error) {
        return <div>Error loading submission for contest! Please try again later!</div>;
    }
    return (
        <div className={`${styles.contestSolutionSubmitWrapper} ${textColorClassName}`}>
            <ContestBreadcrumbs />
            <div className={styles.title}>{name}</div>
            <div className={styles.problemsAndEditorWrapper}>
                <ContestProblems problems={problems || []} />
                <div className={styles.selectedProblemWrapper}>
                    <div className={styles.problemName}>{selectedContestDetailsProblem?.name}</div>
                    {renderProblemDescriptions()}
                    {renderSubmissionsInput()}
                </div>
            </div>
            <div className={styles.submissionsWrapper}>
                <div>Submissions</div>
                { submissionsError
                    ? <>Error loading submissions</>
                    : (
                        <SubmissionsGrid
                          isDataLoaded={!submissionsDataLoading}
                          submissions={submissionsData?.items || []}
                          handlePageChange={() => {}}
                          options={{
                              showDetailedResults: true,
                              showTaskDetails: true,
                              showCompeteMarker: true,
                              showSubmissionTypeInfo: true,
                              showParticipantUsername: true,
                          }}
                        />
                    )}
            </div>
        </div>
    );
};

export default ContestSolutionSubmitPage;
