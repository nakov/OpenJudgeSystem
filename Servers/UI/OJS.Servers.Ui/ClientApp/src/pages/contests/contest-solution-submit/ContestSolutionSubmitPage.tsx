import { useEffect, useState } from 'react';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { IoDocumentText } from 'react-icons/io5';
import { useParams } from 'react-router-dom';

import CodeEditor from '../../../components/code-editor/CodeEditor';
import ContestBreadcrumbs from '../../../components/contests/contest-breadcrumbs/ContestBreadcrumbs';
import ContestProblems from '../../../components/contests/contest-problems/ContestProblems';
import FileUploader from '../../../components/file-uploader/FileUploader';
import Button from '../../../components/guidelines/buttons/Button';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import useTheme from '../../../hooks/use-theme';
import { setContestDetails } from '../../../redux/features/contestsSlice';
import { useGetContestByIdQuery } from '../../../redux/services/contestsService';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { flexCenterObjectStyles } from '../../../utils/object-utils';

import styles from './ContestSolutionSubmitPage.module.scss';

const ContestSolutionSubmitPage = () => {
    const { contestId, participationType } = useParams();
    const { themeColors, getColorClassName } = useTheme();
    const dispatch = useAppDispatch();

    const { contestDetails, selectedContestDetailsProblem } = useAppSelector((state) => state.contests);
    const { data, isLoading, error } = useGetContestByIdQuery({ id: Number(contestId) });
    const [ selectedSubmissionType, setSelectedSubmissionType ] = useState<any>();
    const [ submissionCode, setSubmissionCode ] = useState<string>();

    useEffect(() => {
        if (data?.id !== contestDetails?.id) {
            dispatch(setContestDetails({ contest: data ?? null }));
        }
    }, [ data, contestDetails?.id, dispatch ]);

    useEffect(() => {
        setSubmissionCode('');
    }, [ selectedContestDetailsProblem ]);

    const isContestCompete = participationType === 'compete';

    const { id, name } = data || {};

    const {
        name: selectedProblemName,
        // resources,
        allowedSubmissionTypes,
    } = selectedContestDetailsProblem || {};

    const { competeParticipantsCount, practiceParticipantsCount } = contestDetails || {};

    const textColorClassName = getColorClassName(themeColors.textColor);
    const darkBackgroundClassName = getColorClassName(themeColors.baseColor500);

    const onSolutionSubmit = () => {
        console.log('submitted solution');
    };

    // TBD actual resources
    const renderProblemDescriotions = () => (
        <div className={styles.problemDescriptionsWrapper}>
            <div className={styles.problemDescriptions}>
                <div>
                    <IoDocumentText />
                    {' '}
                    Условия
                </div>
                <div>
                    <IoDocumentText />
                    {' '}
                    Условия 2
                </div>
                <div>
                    <IoDocumentText />
                    {' '}
                    Условия 3
                </div>
                <div>
                    <IoDocumentText />
                    {' '}
                    Условия 4
                </div>
            </div>
            <IoIosInformationCircleOutline />
        </div>
    );

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
                        <div>
                            {isContestCompete
                                ? competeParticipantsCount
                                : practiceParticipantsCount}
                        </div>
                    </span>
                </div>
                <div className={styles.submitSettings}>
                    Dropdown
                    <Button onClick={onSolutionSubmit} text="Submit" />
                </div>
            </div>
        );
    };

    if (isLoading) {
        return <div style={{ ...flexCenterObjectStyles }}><SpinningLoader /></div>;
    }
    if (error) {
        return <div>Error loading details for contest! Please try again later!</div>;
    }
    return (
        <div className={`${styles.contestSolutionSubmitWrapper} ${textColorClassName}`}>
            <ContestBreadcrumbs />
            <div className={styles.title}>{name}</div>
            <div className={styles.problemsAndEditorWrapper}>
                <ContestProblems problems={data?.problems || []} />
                <div className={styles.selectedProblemWrapper}>
                    <div className={styles.problemName}>{selectedProblemName}</div>
                    {renderProblemDescriotions()}
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
