import React, { lazy, useEffect, useState } from 'react';
import isNil from 'lodash/isNil';

import { ISubmissionTypeType } from '../../common/types';
import { fullStrategyNameToStrategyType, strategyTypeToMonacoLanguage } from '../../utils/strategy-type-utils';

import styles from './CodeEditor.module.scss';

const Editor = lazy(() => import('@monaco-editor/react'));

const getMonacoLanguage = (submissionTypeName: string | null) => {
    if (submissionTypeName == null) {
        return 'javascript';
    }

    return strategyTypeToMonacoLanguage(fullStrategyNameToStrategyType(submissionTypeName));
};

interface ICodeEditorProps {
    readOnly?: boolean;
    code?: string;
    selectedSubmissionType?: ISubmissionTypeType | null;
    onCodeChange?: (newValue: string | undefined) => void;
    customEditorStyles?: object;
}

const CodeEditor = ({
    readOnly = false,
    code,
    selectedSubmissionType = null,
    onCodeChange,
    customEditorStyles = {},
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
        <div className={styles.editor} style={{ ...customEditorStyles }}>
            <Editor
              language={getMonacoLanguage(selectedSubmissionTypeName) ?? 'javascript'}
              theme="vs-dark"
              value={code}
              className={styles.editor}
              defaultValue=""
              options={{
                  readOnly,
                  selectOnLineNumbers: true,
                  minimap: { enabled: false },
                  automaticLayout: true,
                  hideCursorInOverviewRuler: true,
                  lineHeight: 20,
                  scrollbar: {
                      vertical: 'hidden',
                      alwaysConsumeMouseWheel: false,
                  },
                  scrollBeyondLastLine: false,
              }}
              onChange={onCodeChange}
              keepCurrentModel={false}
            />
        </div>
    );
};

export default CodeEditor;
