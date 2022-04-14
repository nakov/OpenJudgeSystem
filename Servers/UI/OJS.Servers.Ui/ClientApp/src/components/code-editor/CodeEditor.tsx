import * as React from 'react';
import { useEffect, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { useSubmissions } from '../../hooks/submissions/use-submissions';
import { useContests } from '../../hooks/use-contests';
import styles from './CodeEditor.module.scss';

const possibleLanguages = [
    'python',
    'javascript',
    'csharp',
    'java',
    'cpp',
    'go',
    'php',
];

const getMonacoLanguage = (submissionTypeName: string | null) => {
    if (submissionTypeName == null) {
        return 'javascript';
    }

    return possibleLanguages.find((x) => submissionTypeName.toLowerCase().indexOf(x) >= 0);
};

const CodeEditor = () => {
    const [ selectedSubmissionTypeName, setSelectedSubmissionTypeName ] = useState<string | null>(null);
    const {
        currentSubmissionCode,
        setCode,
    } = useSubmissions();

    const {
        currentProblem,
        selectedSubmissionTypeId,
    } = useContests();

    const { allowedSubmissionTypes } = currentProblem || {};

    const onCodeChange = (newValue: string) => {
        setCode(newValue);
    };

    useEffect(
        () => {
            if (allowedSubmissionTypes == null) {
                return;
            }
            const submissionType = allowedSubmissionTypes.find((x) => x.id === selectedSubmissionTypeId);
            setSelectedSubmissionTypeName(submissionType?.name || null);
        },
        [ allowedSubmissionTypes, selectedSubmissionTypeId ],
    );

    return (
        <div className={styles.editor}>
            <MonacoEditor
              language={getMonacoLanguage(selectedSubmissionTypeName)}
              theme="vs-dark"
              value={currentSubmissionCode}
              className={styles.editor}
              options={{
                  selectOnLineNumbers: true,
                  minimap: { enabled: false },
                  automaticLayout: true,
                  hideCursorInOverviewRuler: true,
                  lineHeight: 20,
                  scrollbar: { vertical: 'hidden' },
              }}
              onChange={onCodeChange}
            />
        </div>
    );
};

export default CodeEditor;
