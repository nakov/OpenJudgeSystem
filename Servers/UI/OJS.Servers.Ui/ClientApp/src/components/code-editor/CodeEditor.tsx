import * as React from 'react';
import MonacoEditor from 'react-monaco-editor';
import { useSubmissions } from '../../hooks/submissions/use-submissions';

const CodeEditor = () => {
    const { currentSubmissionCode, setCode } = useSubmissions();

    const onCodeChange = (newValue: string) => {
        setCode(newValue);
    };

    return (
        <MonacoEditor
          width="600"
          height="400"
          language="JavaScript"
          theme="vs-dark"
          value={currentSubmissionCode}
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
    );
};

export default CodeEditor;
