/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable consistent-return */
/* eslint-disable promise/prefer-await-to-then */
/* eslint-disable promise/always-return */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { IoIosInformationCircleOutline, IoMdRefresh } from 'react-icons/io';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import Popover from '@mui/material/Popover';
import isNil from 'lodash/isNil';
import moment from 'moment';
import { SUBMISSION_SENT } from 'src/common/messages';
import useSuccessMessageEffect from 'src/hooks/common/use-success-message-effect';
import { renderSuccessfullAlert } from 'src/utils/render-utils';

import { ContestParticipationType } from '../../../common/constants';
import { AdjacencyList, IProblemResourceType, IProblemType, ISubmissionTypeType } from '../../../common/types';
import {
    getAllContestsPageUrl,
    getContestsDetailsPageUrl,
    getContestsRegisterPageUrl,
    getContestsResultsPageUrl,
} from '../../../common/urls/compose-client-urls';
import CodeEditor from '../../../components/code-editor/CodeEditor';
import ContestBreadcrumbs from '../../../components/contests/contest-breadcrumbs/ContestBreadcrumbs';
import ContestProblems from '../../../components/contests/contest-problems/ContestProblems';
import ErrorWithActionButtons from '../../../components/error/ErrorWithActionButtons';
import FileUploader from '../../../components/file-uploader/FileUploader';
import AdministrationLink from '../../../components/guidelines/buttons/AdministrationLink';
import Button, { ButtonState } from '../../../components/guidelines/buttons/Button';
import Dropdown from '../../../components/guidelines/dropdown/Dropdown';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import ProblemResource from '../../../components/problem-resources/ProblemResource';
import SubmissionsGrid from '../../../components/submissions/submissions-grid/SubmissionsGrid';
import useTheme from '../../../hooks/use-theme';
import {
    setContestDetailsIdAndCategoryId,
} from '../../../redux/features/contestsSlice';
import {
    useGetContestUserParticipationQuery,
    useSubmitContestSolutionFileMutation,
    useSubmitContestSolutionMutation,
} from '../../../redux/services/contestsService';
import { useLazyGetSubmissionResultsByProblemQuery } from '../../../redux/services/submissionsService';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import {
    calculatedTimeFormatted,
    transformDaysHoursMinutesTextToMinutes,
    transformSecondsToTimeSpan,
} from '../../../utils/dates';
import { getErrorMessage } from '../../../utils/http-utils';
import { flexCenterObjectStyles } from '../../../utils/object-utils';
import { capitalizeFirstLetter } from '../../../utils/string-utils';
import makePrivate from '../../shared/make-private';
import setLayout from '../../shared/set-layout';
import withTitle from '../../shared/with-title';

import styles from './ContestSolutionSubmitPage.module.scss';

const ContestSolutionSubmitPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const { themeColors, getColorClassName } = useTheme();
    const { contestId, participationType, slug } = useParams();

    const [ successMessage, setSuccessMessage ] = useState<string | null>(null);
    const [ isSubmitButtonDisabled, setIsSubmitButtonDisabled ] = useState<boolean>(false);
    const [ remainingTime, setRemainingTime ] = useState<number>(0);
    const [ remainingTimeForCompete, setRemainingTimeForCompete ] = useState<string | null>();
    const [ submissionCode, setSubmissionCode ] = useState<string>();
    const [ anchorEl, setAnchorEl ] = useState<HTMLElement | null>(null);
    const [ selectedSubmissionsPage, setSelectedSubmissionsPage ] = useState<number>(1);
    const [ uploadedFile, setUploadedFile ] = useState<File | null>(null);
    const [ fileUploadError, setFileUploadError ] = useState<string>('');
    const [ isRotating, setIsRotating ] = useState<boolean>(false);
    const [ updatedProblems, setUpdatedProblems ] = useState<Array<IProblemType>>();
    const [ submissionTypesPerProblem, setSubmissionTypesPerProblem ] = useState<AdjacencyList<number, ISubmissionTypeType>>({});

    const { selectedContestDetailsProblem, contestDetails } = useAppSelector((state) => state.contests);
    const { internalUser: user } = useAppSelector((state) => state.authorization);

    const getParticipationType = useCallback(() => {
        if (participationType) {
            return participationType === ContestParticipationType.Compete
                ? ContestParticipationType.Compete
                : ContestParticipationType.Practice;
        }

        return location.pathname.includes(`/${ContestParticipationType.Compete}`)
            ? ContestParticipationType.Compete
            : ContestParticipationType.Practice;
    }, [ participationType, location.pathname ]);

    const [ submitSolution, {
        error: submitSolutionError,
        isSuccess: submitSolutionSuccess,
        isError: submitSolutionHasError,
        isLoading: submitSolutionIsLoading,
    } ] = useSubmitContestSolutionMutation();

    const [ submitSolutionFile, {
        error: submitSolutionFileError,
        isSuccess: submitSolutionFileSuccess,
        isError: submitSolutionFileHasError,
        isLoading: submitSolutionFileIsLoading,
    } ] = useSubmitContestSolutionFileMutation();

    const [
        getSubmissionsData, {
            data: submissionsData,
            isError: submissionsError,
            error: submissionsErrorData,
            isLoading: submissionsDataLoading,
            isFetching: submissionsDataFetching,
        },
    ] = useLazyGetSubmissionResultsByProblemQuery();

    const isModalOpen = Boolean(anchorEl);
    const isCompete = useMemo(() => getParticipationType() === ContestParticipationType.Compete, [ getParticipationType ]);

    const textColorClassName = getColorClassName(themeColors.textColor);
    const lightBackgroundClassName = getColorClassName(themeColors.baseColor100);

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
    } = useGetContestUserParticipationQuery({ id: Number(contestId!), isOfficial: isCompete });

    const {
        contest,
        isRegisteredParticipant,
        isInvalidated,
        isActiveParticipant,
        participantsCount,
        lastSubmissionTime,
        userSubmissionsTimeLimit,
        endDateTimeForParticipantOrContest,
    } = data || {};

    const { problems = [] } = contest || {};

    const {
        memoryLimit,
        timeLimit,
        fileSizeLimit,
        checkerName,
        allowedSubmissionTypes: problemAllowedSubmissionTypes,
    } = selectedContestDetailsProblem || {};

    const strategyDropdownItems = useMemo(() => {
        if (!problemAllowedSubmissionTypes) { return []; }

        return problemAllowedSubmissionTypes.map((item) => ({
            id: item.id,
            name: item.name,
        })).sort((a, b) => a.id - b.id);
    }, [ problemAllowedSubmissionTypes ]);

    const selectedSubmissionType = useMemo(() => {
        if (!selectedContestDetailsProblem) { return undefined; }
        return submissionTypesPerProblem[selectedContestDetailsProblem.id];
    }, [ selectedContestDetailsProblem, submissionTypesPerProblem ]);

    const onStrategyDropdownItemSelect = useCallback(
        (submission: ISubmissionTypeType) => {
            if (!selectedContestDetailsProblem || !submission.id) {
                return;
            }

            setSubmissionTypesPerProblem((prev) => ({
                ...prev,
                [selectedContestDetailsProblem.id]: submission,
            }));
        },
        [ selectedContestDetailsProblem ],
    );

    const handleRefreshClick = () => {
        setIsRotating(true);
        if (selectedContestDetailsProblem) {
            getSubmissionsData({
                id: Number(selectedContestDetailsProblem.id),
                page: selectedSubmissionsPage,
                isOfficial: isCompete,
            });
        }
    };

    useSuccessMessageEffect({
        data: [
            { message: SUBMISSION_SENT, shouldGet: submitSolutionSuccess },
            { message: SUBMISSION_SENT, shouldGet: submitSolutionFileSuccess },
        ],
        setSuccessMessage,
        clearFlags: [ submitSolutionIsLoading, submitSolutionFileIsLoading ],
    });

    useEffect(() => {
        if (problems) {
            const initialSubmissionTypes: AdjacencyList<number, ISubmissionTypeType> = {};
            problems.forEach((problem: IProblemType) => {
                const defaultType = problem.allowedSubmissionTypes.find((type) => type.id === problem.defaultSubmissionTypeId);
                if (defaultType) {
                    initialSubmissionTypes[problem.id] = defaultType;
                } else if (problem.allowedSubmissionTypes.length > 0) {
                    initialSubmissionTypes[problem.id] = problem.allowedSubmissionTypes[0];
                }
            });
            setSubmissionTypesPerProblem(initialSubmissionTypes);
        }
    }, [ problems ]);

    useEffect(() => {
        if (submissionsData?.items && problems && submissionsData.items.length > 0) {
            // eslint-disable-next-line max-len
            const latestSubmission = submissionsData.items.reduce((latest, current) => new Date(current.createdOn) > new Date(latest.createdOn)
                ? current
                : latest);

            const updatedProblemIndex = problems.findIndex((problem) => problem.id === latestSubmission.problem.id);

            if (updatedProblemIndex !== -1) {
                const newUpdatedProblems = [ ...problems ];
                newUpdatedProblems[updatedProblemIndex] = {
                    ...problems[updatedProblemIndex],
                    points: Math.max(latestSubmission.result.points, problems[updatedProblemIndex].points),
                };

                if (JSON.stringify(newUpdatedProblems) !== JSON.stringify(problems)) {
                    refetch();
                }
                setUpdatedProblems(newUpdatedProblems);
            }
        }
    }, [ submissionsData, problems, refetch ]);

    useEffect(() => {
        if (!submissionsDataFetching) {
            setTimeout(() => {
                setIsRotating(false);
            }, 900);
        }
    }, [ submissionsDataFetching ]);

    // Disable submit button based on submission time limits
    useEffect(() => {
        if (!lastSubmissionTime || !userSubmissionsTimeLimit) {
            return;
        }

        const intervalId = setInterval(() => {
            const currentTime = moment();
            const elapsedTimeInSeconds = moment.utc(currentTime).diff(moment.utc(lastSubmissionTime), 'seconds');
            const newRemainingTime = userSubmissionsTimeLimit - elapsedTimeInSeconds;

            if (newRemainingTime <= 0) {
                setIsSubmitButtonDisabled(false);
                setRemainingTime(0);
                clearInterval(intervalId);
            } else {
                setRemainingTime(newRemainingTime);
                setIsSubmitButtonDisabled(true);
            }
        });

        return () => {
            clearInterval(intervalId);
        };
    }, [ lastSubmissionTime, userSubmissionsTimeLimit ]);

    // Manage remaining time for compete contest
    useEffect(() => {
        if (!endDateTimeForParticipantOrContest) {
            return;
        }

        const remainingTimeForParticipantOrContest = moment.utc(moment()).diff(moment.utc(endDateTimeForParticipantOrContest));
        if (remainingTimeForParticipantOrContest > 0) {
            // Positive time means time is past end time for contest or participant
            return;
        }

        const intervalId = setInterval(() => {
            const currentTime = moment();
            const remainingCompeteTime = moment.utc(endDateTimeForParticipantOrContest).diff(moment.utc(currentTime));

            if (remainingCompeteTime > 0) {
                const formattedTime = calculatedTimeFormatted(moment.duration(remainingCompeteTime, 'milliseconds'));
                setRemainingTimeForCompete(formattedTime);
            } else {
                setRemainingTimeForCompete(calculatedTimeFormatted(moment.duration(0, 'milliseconds')));
                clearInterval(intervalId);
            }
        });

        return () => {
            clearInterval(intervalId);
        };
    }, [ endDateTimeForParticipantOrContest ]);

    // Redirect unregistered users in compete contests
    useEffect(() => {
        if (isLoading) {
            return;
        }
        if (((!isRegisteredParticipant && !isActiveParticipant) && !isError) || isInvalidated) {
            navigate(getContestsRegisterPageUrl({
                isCompete,
                contestId,
                contestName: slug,
            }), { replace: true });
        }
    }, [ isLoading, isError, isRegisteredParticipant, isActiveParticipant, contestId, isCompete, navigate, slug, isInvalidated ]);

    useEffect(() => {
        setSubmissionCode('');
    }, [ selectedContestDetailsProblem ]);

    // Ensure contest details are set in state
    useEffect(() => {
        if (!contestDetails || contestDetails.id !== Number(contestId)) {
            if (!data?.contest) {
                return;
            }

            dispatch(setContestDetailsIdAndCategoryId({
                id: data!.contest!.id,
                name: data.contest.name,
                categoryId: data!.contest!.categoryId,
            }));
        }
    }, [ contestDetails, contestId, data, dispatch ]);

    // Fetch submissions when the selected problem changes
    useEffect(() => {
        if (selectedContestDetailsProblem && isActiveParticipant && isRegisteredParticipant) {
            getSubmissionsData({
                id: Number(selectedContestDetailsProblem.id),
                page: selectedSubmissionsPage,
                isOfficial: isCompete,
            });
        }
    }, [
        isActiveParticipant,
        isRegisteredParticipant,
        selectedContestDetailsProblem,
        getSubmissionsData,
        selectedSubmissionsPage,
        isCompete,
    ]);

    const onPopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const onPopoverClose = () => {
        setAnchorEl(null);
    };

    const onSolutionSubmitCode = useCallback(() => {
        if (!selectedSubmissionType) { return; }
        setSubmissionCode('');
        submitSolution({
            content: submissionCode!,
            official: isCompete,
            problemId: selectedContestDetailsProblem?.id!,
            submissionTypeId: selectedSubmissionType?.id!,
        }).then((d) => {
            if (!(d as any).error) {
                refetch();
                getSubmissionsData({
                    id: Number(selectedContestDetailsProblem!.id),
                    page: selectedSubmissionsPage,
                    isOfficial: isCompete,
                });
            }
        }).catch(() => { });
    }, [
        getSubmissionsData,
        isCompete,
        refetch, selectedContestDetailsProblem, selectedSubmissionType, selectedSubmissionsPage, submissionCode, submitSolution ]);

    const onSolutionSubmitFile = useCallback(async () => {
        if (!selectedSubmissionType || !uploadedFile) { return; }
        setUploadedFile(null);

        await submitSolutionFile({
            content: uploadedFile!,
            official: isCompete,
            problemId: selectedContestDetailsProblem?.id!,
            submissionTypeId: selectedSubmissionType?.id!,
        });
        refetch();
        await getSubmissionsData({
            id: Number(selectedContestDetailsProblem!.id),
            page: selectedSubmissionsPage,
            isOfficial: isCompete,
        });
    }, [
        getSubmissionsData,
        isCompete,
        refetch,
        selectedContestDetailsProblem,
        selectedSubmissionType,
        selectedSubmissionsPage,
        submitSolutionFile,
        uploadedFile,
    ]);

    const sumMyPoints = useMemo(() => contest
        ? (updatedProblems || contest.problems).reduce((accumulator, problem) => accumulator + problem.points, 0)
        : 0, [ contest, updatedProblems ]);

    const sumAllContestPoints = useMemo(() => contest
        ? (updatedProblems || contest.problems).reduce((accumulator, problem) => accumulator + problem.maximumPoints, 0)
        : 0, [ contest, updatedProblems ]);

    const renderProblemAdminButtons = useCallback(
        () => contest && contest.userIsAdminOrLecturerInContest && selectedContestDetailsProblem && (
            <div className={styles.adminButtonsContainer}>
                <AdministrationLink
                  text="Problem"
                  to={`/problems?filter=id~equals~${
                        selectedContestDetailsProblem!.id
                  }%26%26%3Bisdeleted~equals~false&sorting=id%3DDESC`}
                />
                <AdministrationLink
                  text="Tests"
                  to={`/problems/${
                        selectedContestDetailsProblem!.id
                  }#tab-tests`}
                />
                {user.isAdmin && (
                    <AdministrationLink
                      text="View docs"
                      to={`/submission-type-documents-view?submissionTypeIds=${selectedContestDetailsProblem.allowedSubmissionTypes
                          .map((st) => st.id)
                          .join(',')}`}
                    />
                )}
            </div>
        ),
        [ contest, selectedContestDetailsProblem, user.isAdmin ],
    );

    const renderProblemResources = useCallback(() => {
        if (!selectedContestDetailsProblem) {
            return;
        }

        const { resources } = selectedContestDetailsProblem;

        return (
            <div className={styles.problemResources}>
                {resources.map((resource: IProblemResourceType) => (
                    <ProblemResource
                      key={`resource-${resource.id}`}
                      resource={resource}
                      problem={selectedContestDetailsProblem.name}
                    />
                ))}
            </div>
        );
    }, [ selectedContestDetailsProblem ]);

    const renderProblemResourcesAndParameters = useCallback(() => {
        if (!selectedContestDetailsProblem) {
            return;
        }

        const tLimit = !isNil(selectedSubmissionType?.timeLimit)
            ? selectedSubmissionType?.timeLimit
            : timeLimit;

        const mLimit = !isNil(selectedSubmissionType?.memoryLimit)
            ? selectedSubmissionType?.memoryLimit
            : memoryLimit;

        return (
            <div className={styles.problemParametersWrapper}>
                <div onMouseEnter={onPopoverOpen} onMouseLeave={onPopoverClose}>
                    <IoIosInformationCircleOutline size={20} />
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
                            <span>
                                {tLimit
                                    ? (tLimit / 1000).toFixed(2)
                                    : 0}
                            </span>
                            {' '}
                            sec
                        </div>
                        <div>
                            <span className={styles.title}>Allowed memory:</span>
                            {' '}
                            <span>
                                {mLimit
                                    ? (mLimit / 1024 / 1024).toFixed(2)
                                    : 0}
                            </span>
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
                        {checkerName && (
                            <div>
                                <span className={styles.title}>Checker:</span>
                                {' '}
                                {checkerName}
                            </div>
                        )}
                    </div>
                </Popover>
            </div>
        );
    }, [
        selectedContestDetailsProblem,
        selectedSubmissionType,
        isModalOpen,
        anchorEl,
        textColorClassName,
        lightBackgroundClassName,
        timeLimit,
        memoryLimit,
        fileSizeLimit,
        checkerName,
    ]);

    const renderRemainingTimeForContest = useCallback(() => {
        if (remainingTimeForCompete) {
            const leftMinutes = transformDaysHoursMinutesTextToMinutes(remainingTimeForCompete);
            return (
                <div className={leftMinutes <= 30
                    ? styles.errorText
                    : ''}
                >
                    Remaining time:
                    <b>
                        {remainingTimeForCompete}
                    </b>
                </div>
            );
        }

        // Contests without ending time
        if (!remainingTimeForCompete) {
            return (
                <div>
                    <b>No expire time</b>
                </div>
            );
        }

        return (
            <span className={styles.errorText}>
                Participation time has expired
            </span>
        );
    }, [ remainingTimeForCompete ]);

    const renderSubmissionsInput = useCallback(() => {
        if (!selectedSubmissionType) {
            return null;
        }

        const {
            allowBinaryFilesUpload,
            allowedFileExtensions,
        } = selectedSubmissionType;

        if (allowBinaryFilesUpload) {
            return (
                <div className={styles.fileUpload}>
                    <div>
                        <span>Allowed extensions:</span>
                        {' '}
                        {(allowedFileExtensions || []).join(', ')}
                    </div>
                    {fileUploadError && <div className={styles.fileUploadError}>{fileUploadError}</div>}
                    <FileUploader
                      file={uploadedFile}
                      problemId={selectedContestDetailsProblem?.id}
                      allowedFileExtensions={(allowedFileExtensions || [])}
                      onInvalidFileExtension={(e) => setFileUploadError(e.detail)}
                      onFileUpload={(file) => {
                          setFileUploadError('');
                          setUploadedFile(file);
                      }}
                    />
                    <div className={styles.remainingTimeNadSubmitButtonWrapper}>
                        <Dropdown
                          dropdownItems={strategyDropdownItems || []}
                          placeholder="Select strategy"
                          value={selectedSubmissionType?.id.toString() || ''}
                          handleDropdownItemClick={onStrategyDropdownItemSelect}
                        />
                        <Button
                          onClick={onSolutionSubmitFile}
                          text="Submit"
                          state={isSubmitButtonDisabled || submitSolutionFileIsLoading || fileUploadError
                              ? ButtonState.disabled
                              : ButtonState.enabled}
                        />
                        {remainingTime > 0 && (
                            <div className={styles.remainingTimeWrapper}>
                                {transformSecondsToTimeSpan(remainingTime)}
                                {' '}
                                until next submit
                            </div>
                        )}
                        {submitSolutionFileHasError && (
                            <div className={styles.solutionSubmitError}>
                                {getErrorMessage(submitSolutionFileError)}
                            </div>
                        )}
                    </div>
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
                      dropdownItems={strategyDropdownItems || []}
                      placeholder="Select strategy"
                      value={selectedSubmissionType?.id.toString() || ''}
                      handleDropdownItemClick={onStrategyDropdownItemSelect}
                    />
                    <div className={styles.remainingTimeNadSubmitButtonWrapper}>
                        <Button
                          state={isSubmitButtonDisabled || submitSolutionIsLoading
                              ? ButtonState.disabled
                              : ButtonState.enabled}
                          onClick={onSolutionSubmitCode}
                          text="Submit"
                        />
                        {remainingTime > 0 && (
                            <div className={styles.remainingTimeWrapper}>
                                {transformSecondsToTimeSpan(remainingTime)}
                                {' '}
                                until next submit
                            </div>
                        )}
                    </div>
                </div>
                {submitSolutionHasError && (
                    <div className={styles.solutionSubmitError}>
                        {(submitSolutionError as any).data.detail || 'Error submitting solution. Please try again!'}
                    </div>
                )}
            </div>
        );
    }, [
        selectedSubmissionType,
        submissionCode,
        strategyDropdownItems,
        onStrategyDropdownItemSelect,
        isSubmitButtonDisabled,
        submitSolutionIsLoading,
        onSolutionSubmitCode,
        remainingTime,
        submitSolutionHasError,
        submitSolutionError,
        fileUploadError,
        uploadedFile,
        selectedContestDetailsProblem?.id,
        onSolutionSubmitFile,
        submitSolutionFileIsLoading,
        submitSolutionFileHasError,
        submitSolutionFileError,
    ]);

    if (isLoading) {
        return <div style={{ ...flexCenterObjectStyles }}><SpinningLoader /></div>;
    }

    if (error) {
        return (
            <ErrorWithActionButtons
              message={getErrorMessage(error)}
              backToUrl={getAllContestsPageUrl({})}
              backToText="Back to contests"
            />
        );
    }

    if (isRegisteredParticipant && !isActiveParticipant) {
        return (
            <ErrorWithActionButtons
              message="Access to this contest has expired!"
              backToText="Back to contests"
              backToUrl={getAllContestsPageUrl({})}
            />
        );
    }

    return (
        <div className={`${styles.contestSolutionSubmitWrapper} ${textColorClassName}`}>
            {renderSuccessfullAlert(successMessage)}
            <ContestBreadcrumbs />
            <div className={styles.nameWrapper}>
                <div className={styles.contestNameAndAdminButtons}>
                    <Link
                      to={getContestsDetailsPageUrl({ contestId: contest?.id, contestName: contest?.name })}
                      className={`${styles.title} ${textColorClassName}`}
                    >
                        {contest?.name}
                    </Link>
                    {user.canAccessAdministration && (
                        <div className={styles.adminButtonsContainer}>
                            <AdministrationLink
                              text="Contest"
                              to={`/contests/${contestId}`}
                            />
                            {user.isAdmin && (
                                <AdministrationLink
                                  text="View docs"
                                  to={`/submission-type-documents-view?submissionTypeIds=${problems
                                      ?.flatMap((p) => p.allowedSubmissionTypes)
                                      ?.reduce((acc, st) => {
                                          if (!acc.includes(st.id)) {
                                              acc.push(st.id);
                                          }
                                          return acc;
                                      }, [] as number[])
                                      ?.join(',') ?? ''}`}
                                />
                            )}
                        </div>
                    )}
                </div>
                <div
                  className={styles.allResultsLink}
                  onClick={() => navigate(getContestsResultsPageUrl({
                      contestName: contest?.name,
                      contestId: contest?.id,
                      participationType: getParticipationType(),
                      isSimple: true,
                  }))}
                >
                    Show all results
                </div>
            </div>
            <div className={styles.problemsAndEditorWrapper}>
                <ContestProblems
                  problems={updatedProblems || problems || []}
                  onContestProblemChange={() => setSelectedSubmissionsPage(1)}
                  totalParticipantsCount={participantsCount}
                  sumMyPoints={sumMyPoints}
                  sumTotalPoints={sumAllContestPoints}
                />
                <div className={styles.selectedProblemWrapper}>
                    <div className={styles.problemNameAndTimeWrapper}>
                        <div className={styles.problemName}>
                            {selectedContestDetailsProblem?.name}
                            {selectedContestDetailsProblem?.isExcludedFromHomework && (
                                <span className={textColorClassName}>(not included in final score)</span>)}
                            {renderProblemAdminButtons()}
                        </div>
                        {renderRemainingTimeForContest()}
                    </div>
                    <div className={styles.problemDetailsWrapper}>
                        {renderProblemResources()}
                        {renderProblemResourcesAndParameters()}
                    </div>
                    {renderSubmissionsInput()}
                </div>
            </div>
            <div className={styles.submissionsWrapper}>
                <div className={styles.submissionsTitleWrapper}>
                    <span className={styles.title}>Submissions</span>
                    <Tooltip
                      title="Refresh"
                      onClick={handleRefreshClick}
                    >
                        <span>
                            <IoMdRefresh
                              size={24}
                              className={isRotating
                                  ? styles.rotate
                                  : ''}
                            />
                        </span>
                    </Tooltip>
                </div>
                {submissionsError
                    ? getErrorMessage(submissionsErrorData, 'Error loading submissions')
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

export default makePrivate(setLayout(withTitle(
    ContestSolutionSubmitPage,
    (params) => `${capitalizeFirstLetter(params.participationType || 'Participate')} #${params.contestId}`,
)));
