import * as React from 'react';
import { useEffect, useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { get, isNil } from 'lodash';
import { useSubmissions } from '../../hooks/submissions/use-submissions';
import styles from './CodeEditor.module.scss';
import { useProblems } from '../../hooks/use-problems';

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
        state: {
            submissionCode,
            selectedSubmissionType,
        },
        actions: { updateSubmissionCode },
    } = useSubmissions();

    const { state: { currentProblem } } = useProblems();

    const { allowedSubmissionTypes } = currentProblem || {};

    const onCodeChange = (newValue: string) => {
        updateSubmissionCode(newValue);
    };

    useEffect(
        () => {
            if (isNil(allowedSubmissionTypes)) {
                return;
            }
            const { id } = selectedSubmissionType || {};
            if (isNil(id)) {
                return;
            }

            const submissionType = allowedSubmissionTypes.find((x) => x.id === id);

            const name = get(submissionType, 'name', null);
            setSelectedSubmissionTypeName(name);
        },
        [ allowedSubmissionTypes, selectedSubmissionType ],
    );

    return (
        <div className={styles.editor}>
            <MonacoEditor
              language={getMonacoLanguage(selectedSubmissionTypeName)}
              theme="vs-dark"
              value={submissionCode}
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
