/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { IoIosInformationCircleOutline, IoMdRefresh } from 'react-icons/io';
import { IoDocumentText } from 'react-icons/io5';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Popover from '@mui/material/Popover';

import { ISubmissionTypeType } from '../../../common/types';
import CodeEditor from '../../../components/code-editor/CodeEditor';
import ContestBreadcrumbs from '../../../components/contests/contest-breadcrumbs/ContestBreadcrumbs';
import ContestProblems from '../../../components/contests/contest-problems/ContestProblems';
import Dropdown from '../../../components/dropdown/Dropdown';
import FileUploader from '../../../components/file-uploader/FileUploader';
import Button, { ButtonState } from '../../../components/guidelines/buttons/Button';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import SubmissionsGrid from '../../../components/submissions/submissions-grid/SubmissionsGrid';
import useTheme from '../../../hooks/use-theme';
import { setContestDetails } from '../../../redux/features/contestsSlice';
import {
    useGetContestUserParticipationQuery,
    useLazyGetContestByIdQuery,
    useSubmitContestSolutionMutation,
} from '../../../redux/services/contestsService';
import { useLazyGetSubmissionResultsByProblemQuery } from '../../../redux/services/submissionsService';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { calculatedTimeFormatted, calculateTimeUntil } from '../../../utils/dates';
import { flexCenterObjectStyles } from '../../../utils/object-utils';

import styles from './ContestSolutionSubmitPage.module.scss';

const ContestSolutionSubmitPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { themeColors, getColorClassName } = useTheme();
    const { contestId, participationType } = useParams();

    const [ selectedStrategyValue, setSelectedStrategyValue ] = useState<string>('');
    const [ selectedSubmissionType, setSelectedSubmissionType ] = useState<ISubmissionTypeType>();
    const [ submissionCode, setSubmissionCode ] = useState<string>();
    const [ anchorEl, setAnchorEl ] = useState<HTMLElement | null>(null);
    const [ selectedSubmissionsPage, setSelectedSubmissionsPage ] = useState<number>(1);
    const [ uploadedFile, setUploadedFile ] = useState<File | null>(null);
    const [ fileUploadError, setFileUploadError ] = useState<string>('');

    const { selectedContestDetailsProblem, contestDetails } = useAppSelector((state) => state.contests);

    const [ submitSolution ] = useSubmitContestSolutionMutation();
    const [ getContestById ] = useLazyGetContestByIdQuery();
    const [
        getSubmissionsData, {
            data: submissionsData,
            isError: submissionsError,
            isLoading: submissionsDataLoading,
        },
    ] = useLazyGetSubmissionResultsByProblemQuery();

    const isModalOpen = Boolean(anchorEl);
    const isCompete = participationType === 'compete';

    const textColorClassName = getColorClassName(themeColors.textColor);
    const lightBackgroundClassName = getColorClassName(themeColors.baseColor100);

    const {
        data,
        isLoading,
        error,
    } = useGetContestUserParticipationQuery({ id: Number(contestId!), isOfficial: isCompete });

    const {
        contest,
        isRegisteredParticipant,
        isActiveParticipant,
        participantsCount,
        lastSubmissionTime,
        userSubmissionsTimeLimit,
        endDateTimeForParticipantOrContest,
    } = data || {};

    const { problems, allowedSubmissionTypes = [] } = contest || {};

    const {
        memoryLimit,
        timeLimit,
        fileSizeLimit,
        checkerName,
    } = selectedContestDetailsProblem || {};

    const onStrategyDropdownItemSelect = useCallback((s: any) => {
        const submissionType = allowedSubmissionTypes.find((type: ISubmissionTypeType) => type.id === s.id);

        setSelectedStrategyValue(s.id);
        setSelectedSubmissionType(submissionType);
    }, [ allowedSubmissionTypes ]);

    const strategyDropdownItems = useMemo(
        () => allowedSubmissionTypes?.map((item: any) => ({ id: item.id, name: item.name })),
        [ allowedSubmissionTypes ],
    );

    // in case of not registered user for compete contest, redirect
    // user to register page in order to keep the flow correct
    useEffect(() => {
        if (isLoading) {
            return;
        }
        if (!isRegisteredParticipant && !isActiveParticipant) {
            navigate(`/contests/register/${contestId}/${participationType}`);
        }
    }, [ isLoading, isRegisteredParticipant, isActiveParticipant, contestId, navigate ]);

    useEffect(() => {
        setSubmissionCode('');
    }, [ selectedContestDetailsProblem ]);

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
        if (selectedContestDetailsProblem && isActiveParticipant && isRegisteredParticipant) {
            getSubmissionsData({
                id: Number(selectedContestDetailsProblem!.id),
                page: selectedSubmissionsPage,
                isOfficial: isCompete,
            });
        }
        // rule is disabled because it requires adding fetchUserParticipationDetails to the
        // dependencies which makes it to call itself endlessly, which makes recursive
        // updates and crashes the application

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        isActiveParticipant,
        isRegisteredParticipant,
        selectedContestDetailsProblem,
        participationType,
        getSubmissionsData,
        selectedSubmissionsPage,
        isCompete,
    ]);

    const remainingTimeForParticipationOrContest = useMemo(() => {
        if (endDateTimeForParticipantOrContest) {
            const remainingTime = calculateTimeUntil(new Date(endDateTimeForParticipantOrContest));
            return calculatedTimeFormatted(remainingTime);
        }
        return 0;
    }, [ endDateTimeForParticipantOrContest ]);

    const submitButtonIsAvailable = useMemo(() => {
        if (lastSubmissionTime && userSubmissionsTimeLimit) {
            const secondsSinceLastSubmission = calculateTimeUntil(lastSubmissionTime, 'seconds');
            return userSubmissionsTimeLimit < secondsSinceLastSubmission.seconds();
        }
        return true;
    }, [ lastSubmissionTime, userSubmissionsTimeLimit ]);

    const onPopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const onPopoverClose = () => {
        setAnchorEl(null);
    };

    const onSolutionSubmitCode = () => {
        submitSolution({
            content: submissionCode!,
            official: isCompete,
            problemId: selectedContestDetailsProblem?.id!,
            submissionTypeId: selectedSubmissionType?.id!,
        });
        setSubmissionCode('');
    };

    const onSolutionSubmitFile = () => {
        submitSolution({
            content: uploadedFile!,
            official: isCompete,
            problemId: selectedContestDetailsProblem?.id!,
            submissionTypeId: selectedSubmissionType?.id!,
        });
        setUploadedFile(null);
    };

    const sumMyPoints = useMemo(() => contest
        ? contest.problems.reduce((accumulator, problem) => accumulator + problem.points, 0)
        : 0, [ contest ]);

    const sumAllContestPoints = useMemo(() => contest
        ? contest.problems.reduce((accumulator, problem) => accumulator + problem.maximumPoints, 0)
        : 0, [ contest ]);

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
                <div className={styles.fileUpload}>
                    <div>
                        <span>Allowed extensions:</span>
                        {' '}
                        {allowedFileExtensions.join(', ')}
                    </div>
                    {fileUploadError && <div className={styles.fileUploadError}>{fileUploadError}</div>}
                    <FileUploader
                      file={uploadedFile}
                      problemId={123}
                      allowedFileExtensions={allowedFileExtensions}
                      onInvalidFileExtension={(e) => setFileUploadError(e.detail)}
                      onFileUpload={(file) => {
                          setFileUploadError('');
                          setUploadedFile(file);
                      }}
                    />
                    <Button
                      className={styles.fileSubmitButton}
                      onClick={onSolutionSubmitFile}
                      text="Submit"
                      state={!uploadedFile || fileUploadError || !submitButtonIsAvailable
                          ? ButtonState.disabled
                          : ButtonState.enabled}
                    />
                </div>
            );
        }

        return (
            <div>
                <CodeEditor
                  selectedSubmissionType={selectedSubmissionType}
                  code={submissionCode}
                  onCodeChange={(inputCode) => setSubmissionCode(inputCode)}
                />
                <div className={styles.submitSettings}>
                    <Dropdown
                      dropdownItems={strategyDropdownItems}
                      value={selectedStrategyValue}
                      handleDropdownItemClick={onStrategyDropdownItemSelect}
                    />
                    <Button
                      state={!submitButtonIsAvailable
                          ? ButtonState.disabled
                          : ButtonState.enabled}
                      onClick={onSolutionSubmitCode}
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
        return (
            <div className={styles.contestSolutionSubmitWrapper}>
                <div className={textColorClassName}>Error fetching user participation data!</div>
            </div>
        );
    }

    if (isRegisteredParticipant && !isActiveParticipant) {
        return <div>Contest expired page</div>;
    }

    return (
        <div className={`${styles.contestSolutionSubmitWrapper} ${textColorClassName}`}>
            <ContestBreadcrumbs />
            <div className={styles.nameWrapper}>
                <div className={styles.title}>{contest?.name}</div>
                <div
                  className={styles.allResultsLink}
                  onClick={() => navigate(`/contests/${contest?.id}/${participationType}/results/simple`)}
                >
                    Show all results
                </div>
            </div>
            <div className={styles.problemsAndEditorWrapper}>
                <ContestProblems
                  problems={problems || []}
                  onContestProblemChange={() => setSelectedSubmissionsPage(1)}
                  totalParticipantsCount={participantsCount}
                  sumMyPoints={sumMyPoints}
                  sumTotalPoints={sumAllContestPoints}
                />
                <div className={styles.selectedProblemWrapper}>
                    <div className={styles.problemNameAndTimeWrapper}>
                        <div className={styles.problemName}>
                            {selectedContestDetailsProblem?.name}
                        </div>
                        {
                            endDateTimeForParticipantOrContest && (
                                <div>
                                    Remaining time:
                                    <b>{remainingTimeForParticipationOrContest}</b>
                                </div>
                            )
                        }
                    </div>

                    {renderProblemDescriptions()}
                    {renderSubmissionsInput()}
                </div>
            </div>
            <div className={styles.submissionsWrapper}>
                <div className={styles.submissionsTitleWrapper}>
                    <span>Submissions</span>
                    <IoMdRefresh onClick={() => getSubmissionsData({
                        id: Number(selectedContestDetailsProblem!.id),
                        page: selectedSubmissionsPage,
                        isOfficial: isCompete,
                    })}
                    />
                </div>
                { submissionsError
                    ? <>Error loading submissions</>
                    : (
                        <SubmissionsGrid
                          isDataLoaded={!submissionsDataLoading}
                          submissions={submissionsData ?? undefined}
                          handlePageChange={(page: number) => setSelectedSubmissionsPage(page)}
                          options={{
                              showDetailedResults: true,
                              showTaskDetails: false,
                              showCompeteMarker: true,
                              showSubmissionTypeInfo: true,
                              showParticipantUsername: false,
                          }}
                        />
                    )}
            </div>
        </div>
    );
};

export default ContestSolutionSubmitPage;
