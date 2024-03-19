import { useCallback, useEffect, useMemo, useState } from 'react';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { IoDocumentText } from 'react-icons/io5';
import { Link, useNavigate, useParams } from 'react-router-dom';

import CodeEditor from '../../../components/code-editor/CodeEditor';
import ContestBreadcrumbs from '../../../components/contests/contest-breadcrumbs/ContestBreadcrumbs';
import ContestProblems from '../../../components/contests/contest-problems/ContestProblems';
import Dropdown from '../../../components/dropdown/Dropdown';
import FileUploader from '../../../components/file-uploader/FileUploader';
import Button from '../../../components/guidelines/buttons/Button';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import useTheme from '../../../hooks/use-theme';
import { useGetContestUserParticipationQuery } from '../../../redux/services/contestsService';
import { useAppSelector } from '../../../redux/store';
import { flexCenterObjectStyles } from '../../../utils/object-utils';

import styles from './ContestSolutionSubmitPage.module.scss';

const ContestSolutionSubmitPage = () => {
    const navigate = useNavigate();
    const { themeColors, getColorClassName } = useTheme();
    const { contestId, participationType } = useParams();

    const [ selectedStrategyValue, setSelectedStrategyValue ] = useState<string>('');
    const [ selectedSubmissionType, setSelectedSubmissionType ] = useState();
    const [ submissionCode, setSubmissionCode ] = useState<string>();

    const { selectedContestDetailsProblem } = useAppSelector((state) => state.contests);

    const {
        data,
        isLoading,
        error,
    } = useGetContestUserParticipationQuery({ id: Number(contestId), isOfficial: participationType === 'compete' });

    const { contest, shouldEnterPassword, participantsCount } = data || {};
    const { id, name, problems, allowedSubmissionTypes } = contest || {};

    const textColorClassName = getColorClassName(themeColors.textColor);
    const darkBackgroundClassName = getColorClassName(themeColors.baseColor500);

    useEffect(() => {
        setSubmissionCode('');
    }, [ selectedContestDetailsProblem ]);

    useEffect(() => {
        if (shouldEnterPassword) {
            navigate('/enter-exam-password');
        }
    }, [ shouldEnterPassword, navigate ]);

    const strategyDropdownItems = useMemo(
        () => allowedSubmissionTypes?.map((item: any) => ({ id: item.id, name: item.name })),
        [ allowedSubmissionTypes ],
    );

    const onSolutionSubmit = () => {
        console.log('submitted solution');
    };

    const onStrategyDropdownItemSelect = (s: any) => {
        setSelectedStrategyValue(s.id);
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
                <IoIosInformationCircleOutline />
            </div>
        );
    }, [ selectedContestDetailsProblem ]);

    const renderSubmissionsInput = () => {
        const { allowBinaryFilesUpload, allowedFileExtensions } = allowedSubmissionTypes || {} as any;
        if (allowBinaryFilesUpload) {
            return (
                <>
                    <FileUploader
                      file={null}
                      problemId={id}
                      allowedFileExtensions={allowedFileExtensions}
                      onInvalidFileExtension={() => console.log('error on submit!')}
                    />
                    <p>
                        Allowed file extensions:
                        {' '}
                        {allowedFileExtensions.join(', ')}
                    </p>
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
                    <Button onClick={onSolutionSubmit} text="Submit" />
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
            </div>
        </div>
    );
};

export default ContestSolutionSubmitPage;
