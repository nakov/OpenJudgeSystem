/* eslint-disable react/no-danger */

import React, { useCallback } from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import Prism from 'prismjs';

import 'prismjs/components/prism-javascript';

import 'prismjs/themes/prism-okaidia.css';

interface ITestsRunDiffProps {
    expectedStr: string,
    actualStr: string
}

const Diff = ({ expectedStr, actualStr } : ITestsRunDiffProps) => {
    const highlightSyntax = useCallback((str: string) => {
        if (str) {
            return (
                <pre
                  style={{ display: 'inline' }}
                  dangerouslySetInnerHTML={{ __html: Prism.highlight(str, Prism.languages.text, 'apex') }}
                />
            );
        }

        return (
            <></>
        );
    }, []);

    return (
        <ReactDiffViewer
          oldValue={expectedStr}
          newValue={actualStr}
          compareMethod={DiffMethod.CHARS}
          splitView
          showDiffOnly
          renderContent={highlightSyntax}
        />
    );
};

export default Diff;
