import * as React from 'react';
import MonacoEditor from 'react-monaco-editor';
import { useSubmissions } from '../../hooks/submissions/use-submissions';
import styles from './CodeEditor.module.scss';

const CodeEditor = () => {
    const { currentSubmissionCode, setCode } = useSubmissions();

    const onCodeChange = (newValue: string) => {
        setCode(newValue);
    };

    return (
        <div className={styles.editor}>
            <MonacoEditor
              language="JavaScript"
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
