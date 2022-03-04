import * as React from 'react';
import MonacoEditor from 'react-monaco-editor';
import { useState } from 'react';

const defaultState = { code: 'Write your code here' };

const CodeEditor = () => {
    const [ code, setCode ] = useState<string>(defaultState.code);

    const onCodeChange = (newValue: string, e: any) => {
        setCode(newValue);
        console.log('onChange', newValue, e);
    };

    return (
        <MonacoEditor
          width="600"
          height="400"
          language="javascript"
          theme="vs-dark"
          value={code}
          options={{
              selectOnLineNumbers: true,
              minimap: { enabled: false },
              automaticLayout: true,
              hideCursorInOverviewRuler: true,
              lineHeight: 20,
              scrollbar: {
                  horizontal: 'hidden',
                  vertical: 'hidden',
              },
          }}
          onChange={onCodeChange}
        />
    );
};

export default CodeEditor;
