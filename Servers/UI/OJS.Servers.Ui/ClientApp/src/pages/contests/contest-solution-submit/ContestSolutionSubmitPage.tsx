import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { IoDocumentText } from 'react-icons/io5';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Popover from '@mui/material/Popover';

import { ISubmissionTypeType } from '../../../common/types';
import CodeEditor from '../../../components/code-editor/CodeEditor';
import ContestBreadcrumbs from '../../../components/contests/contest-breadcrumbs/ContestBreadcrumbs';
import ContestCompeteModal from '../../../components/contests/contest-compete-modal/ContestCompeteModal';
import ContestPasswordForm from '../../../components/contests/contest-password-form/ContestPasswordForm';
import ContestProblems from '../../../components/contests/contest-problems/ContestProblems';
import Dropdown from '../../../components/dropdown/Dropdown';
import FileUploader from '../../../components/file-uploader/FileUploader';
import Button, { ButtonState } from '../../../components/guidelines/buttons/Button';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import SubmissionsGrid from '../../../components/submissions/submissions-grid/SubmissionsGrid';
import useTheme from '../../../hooks/use-theme';
import { setContestDetails } from '../../../redux/features/contestsSlice';
import {
    useGetContestRegisteredUserQuery,
    useLazyGetContestByIdQuery,
    useLazyGetContestUserParticipationQuery,
    useSubmitContestSolutionMutation,
} from '../../../redux/services/contestsService';
import { useLazyGetSubmissionResultsByProblemQuery } from '../../../redux/services/submissionsService';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { flexCenterObjectStyles } from '../../../utils/object-utils';

import styles from './ContestSolutionSubmitPage.module.scss';

const ContestSolutionSubmitPage = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { themeColors, getColorClassName } = useTheme();
    const { contestId, participationType } = useParams();

    const [ userParticipationData, setUserParticipationData ] = useState<any>({});
    const [ userParticipationDataLoading, setUserParticipationDataLoading ] = useState<boolean>(false);
    const [ userParticipationError, setUserParticipationError ] = useState<string>();
    const [ selectedStrategyValue, setSelectedStrategyValue ] = useState<string>('');
    const [ selectedSubmissionType, setSelectedSubmissionType ] = useState<ISubmissionTypeType>();
    const [ submissionCode, setSubmissionCode ] = useState<string>();
    const [ anchorEl, setAnchorEl ] = useState<HTMLElement | null>(null);
    const [ submissionsData, setSubmissionsData ] = useState(null);
    const [ submissionsError, setSubmissionsError ] = useState('');
    const [ submissionsDataLoading, setSubmissionsDataLoading ] = useState<boolean>(false);
    const [ hasAcceptedOnlineExamModal, setHasAcceptedOnlineExamModal ] = useState<boolean>(false);
    const [ selectedSubmissionsPage, setSelectedSubmissionsPage ] = useState<number>(1);
    const [ uploadedFile, setUploadedFile ] = useState(null);
    const [ fileUploadError, setFileUploadError ] = useState<string>('');

    const { selectedContestDetailsProblem, contestDetails } = useAppSelector((state) => state.contests);

    const [ submitSolution ] = useSubmitContestSolutionMutation();
    const [ getContestById ] = useLazyGetContestByIdQuery();
    const [ getSubmissionsData ] = useLazyGetSubmissionResultsByProblemQuery();
    const [ getContestUserParticipation ] = useLazyGetContestUserParticipationQuery();

    const isCompete = participationType === 'compete';
    const isModalOpen = Boolean(anchorEl);

    const textColorClassName = getColorClassName(themeColors.textColor);
    const darkBackgroundClassName = getColorClassName(themeColors.baseColor500);
    const lightBackgroundClassName = getColorClassName(themeColors.baseColor100);

    const {
        data,
        isLoading,
        error,
    } = useGetContestRegisteredUserQuery({ id: Number(contestId), isOfficial: isCompete });

    const { requirePassword, isOnlineExam, name, numberOfProblems, duration, id } = data || {};
    const { contest, shouldEnterPassword, participantsCount } = userParticipationData || {};
    const { problems = [], allowedSubmissionTypes = [] } = contest || {};
    const {
        memoryLimit,
        timeLimit,
        fileSizeLimit,
        checkerName,
    } = selectedContestDetailsProblem || {};

    const fetchUserParticipationDetails = async () => {
        setUserParticipationDataLoading(true);

        try {
            const { data: queryData } = await getContestUserParticipation({
                id: Number(contestId),
                isOfficial: isCompete,
            });

            setUserParticipationError('');
            setUserParticipationData(queryData);
            setUserParticipationDataLoading(false);
        } catch {
            setUserParticipationError('Error loading user participation data!');
            setUserParticipationData({});
            setUserParticipationDataLoading(false);
        }
    };

    const onStrategyDropdownItemSelect = useCallback((s: any) => {
        const submissionType = allowedSubmissionTypes.find((type: ISubmissionTypeType) => type.id === s.id);

        setSelectedStrategyValue(s.id);
        setSelectedSubmissionType(submissionType);
    }, [ allowedSubmissionTypes ]);

    const strategyDropdownItems = useMemo(
        () => allowedSubmissionTypes?.map((item: any) => ({ id: item.id, name: item.name })),
        [ allowedSubmissionTypes ],
    );

    useEffect(() => {
        setSubmissionCode('');
    }, [ selectedContestDetailsProblem ]);

    // fetch contest data, when user has accepted online exam modal,
    // entered password correctly and has accessed contest data
    useEffect(() => {
        if ((isOnlineExam
            ? hasAcceptedOnlineExamModal
            : true) && !requirePassword) {
            fetchUserParticipationDetails();
        }
    }, [ isOnlineExam, hasAcceptedOnlineExamModal, requirePassword, contestId, getContestUserParticipation, participationType ]);

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
                        page: selectedSubmissionsPage,
                        isOfficial: isCompete,
                    });

                    setSubmissionsError('');
                    setSubmissionsData(currentSubmissionsData);
                    setSubmissionsDataLoading(false);
                } catch {
                    setSubmissionsError('Error loading submissions!');
                    setSubmissionsData(null);
                    setSubmissionsDataLoading(false);
                }
            };

            fetchSubmissionsData();
        }
    }, [ selectedContestDetailsProblem, participationType, getSubmissionsData, selectedSubmissionsPage, isCompete ]);

    const onPopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const onPopoverClose = () => {
        setAnchorEl(null);
    };

    const onSolutionSubmitCode = () => {
        submitSolution({
            content: submissionCode,
            official: isCompete,
            problemId: selectedContestDetailsProblem?.id,
            submissionTypeId: selectedSubmissionType?.id,
        });
        setSubmissionCode('');
    };

    const onSolutionSubmitFile = () => {
        submitSolution({
            content: uploadedFile,
            official: isCompete,
            problemId: selectedContestDetailsProblem?.id,
            submissionTypeId: selectedSubmissionType?.id,
        });
        setUploadedFile(null);
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
                <div className={styles.fileUpload}>
                    <div>
                        <span>Allowed extensions:</span>
                        {' '}
                        {allowedFileExtensions.join(', ')}
                    </div>
                    {fileUploadError && <div className={styles.fileUploadError}>{fileUploadError}</div>}
                    <FileUploader
                      file={uploadedFile}
                      problemId={id}
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
                      state={!uploadedFile || fileUploadError
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
                      onClick={onSolutionSubmitCode}
                      text="Submit"
                    />
                </div>
            </div>
        );
    };

    if (isLoading || userParticipationDataLoading) {
        return <div style={{ ...flexCenterObjectStyles }}><SpinningLoader /></div>;
    }

    if (error || userParticipationError) {
        return (
            <div className={styles.contestSolutionSubmitWrapper}>
                <div className={textColorClassName}>Error fetching user participation data!</div>
            </div>
        );
    }

    if (requirePassword && shouldEnterPassword) {
        return (
            <ContestPasswordForm
              id={Number(contestId)}
              isOfficial={isCompete}
              contestName={name}
              onSuccess={fetchUserParticipationDetails}
            />
        );
    }

    if (isCompete && isOnlineExam && !hasAcceptedOnlineExamModal) {
        return (
            <ContestCompeteModal
              examName={name}
              time={duration}
              problemsCount={numberOfProblems}
              onAccept={() => setHasAcceptedOnlineExamModal(true)}
              onDecline={() => navigate('/contests')}
            />
        );
    }

    return (
        <div className={`${styles.contestSolutionSubmitWrapper} ${textColorClassName}`}>
            <ContestBreadcrumbs />
            <div className={styles.title}>{name}</div>
            <div className={styles.problemsAndEditorWrapper}>
                <ContestProblems problems={problems || []} onContestProblemChange={() => setSelectedSubmissionsPage(1)} />
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
                          submissions={submissionsData ?? undefined}
                          handlePageChange={(page: number) => setSelectedSubmissionsPage(page)}
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
