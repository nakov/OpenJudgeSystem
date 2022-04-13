import * as React from 'react';
import { useEffect, useState } from 'react';
import MonacoEditor, { monaco } from 'react-monaco-editor';
import { useSubmissions } from '../../hooks/submissions/use-submissions';
import { useContests } from '../../hooks/contests/use-contests';
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

    // const editorRef = useRef(null);
    //
    // eslint-disable-next-line max-len
    // const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco: MonacoEditor) => {
    //     // @ts-ignore
    //     editorRef.current = editor;
    //
    //     console.log(monaco.languages.getLanguages());
    //     // @ts-ignore
    //     console.log('editor', editor.getModel().getLanguageIdentifier().language);
    // };

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

    console.log(getMonacoLanguage(selectedSubmissionTypeName));

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
              // editorWillMount={handleEditorDidMount}
              // ref={editorRef}
              onChange={onCodeChange}
            />
        </div>
    );
};

export default CodeEditor;
