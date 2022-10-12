import React, { lazy, useEffect, useState } from 'react';
import isNil from 'lodash/isNil';

import { ISubmissionTypeType } from '../../common/types';

import styles from './CodeEditor.module.scss';

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
    readOnly?: boolean;
    code?: string;
    selectedSubmissionType?: ISubmissionTypeType;
    onCodeChange?: (newValue: string) => void;
}

const CodeEditor = ({
    readOnly = false,
    code,
    selectedSubmissionType,
    onCodeChange,
}: ICodeEditorProps) => {
    const [ selectedSubmissionTypeName, setSelectedSubmissionTypeName ] = useState<string | null>(null);

    useEffect(
        () => {
            const { name } = selectedSubmissionType || {};

            if (isNil(name)) {
                return;
            }

            setSelectedSubmissionTypeName(name);
        },
        [ selectedSubmissionType ],
    );

    /* eslint-disable @typescript-eslint/no-empty-function */
    return (
        <div className={styles.editor}>
            <MonacoEditor
              language={getMonacoLanguage(selectedSubmissionTypeName)}
              theme="vs-dark"
              value={code}
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
              editorWillUnmount={() => {}}
            />
        </div>
    );
};

export default CodeEditor;
