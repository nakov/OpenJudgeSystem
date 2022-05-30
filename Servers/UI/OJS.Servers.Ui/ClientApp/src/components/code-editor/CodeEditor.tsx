import * as React from 'react';
import { lazy, useCallback, useEffect, useState } from 'react';
import { get, isNil } from 'lodash';
import { useSubmissions } from '../../hooks/submissions/use-submissions';
import styles from './CodeEditor.module.scss';
import { useProblems } from '../../hooks/use-problems';
import { ISubmissionTypeType } from '../../common/types';

const MonacoEditor = lazy(() => import('react-monaco-editor'));

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

interface ICodeEditorProps {
    readOnly: boolean;
    submissionCode?: string;
    selectedSubmissionType?: ISubmissionTypeType;
    allowedSubmissionTypes?: ISubmissionTypeType[];
    onCodeChange?: (newValue: string) => void;
}

const CodeEditor = ({ readOnly, submissionCode, selectedSubmissionType, allowedSubmissionTypes, onCodeChange }: ICodeEditorProps) => {
    const [ selectedSubmissionTypeName, setSelectedSubmissionTypeName ] = useState<string | null>(null);

    useEffect(
        () => {
            if (readOnly) {
                return;
            }

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
        [ allowedSubmissionTypes, readOnly, selectedSubmissionType ],
    );

    return (
        <div className={styles.editor}>
            <MonacoEditor
              language={getMonacoLanguage(selectedSubmissionTypeName)}
              theme="vs-dark"
              value={submissionCode}
              className={styles.editor}
              options={{
                  readOnly,
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
