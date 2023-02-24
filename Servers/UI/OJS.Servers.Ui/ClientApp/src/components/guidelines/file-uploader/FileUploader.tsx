import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import isNil from 'lodash/isNil';

import { useSubmissions } from '../../../hooks/submissions/use-submissions';
import { useProblems } from '../../../hooks/use-problems';
import Button, { ButtonSize, ButtonType } from '../buttons/Button';

const FileUploader = () => {
    // Create a reference to the hidden file input element
    const hiddenFileInput = useRef<HTMLInputElement | null>(null);
    const { state: { problemSubmissionCode }, actions: { updateSubmissionCode } } = useSubmissions();
    const { state: { currentProblem } } = useProblems();
    const [ file, setFile ] = useState<Blob>();

    // Programatically click the hidden file input element
    // when the Button component is clicked
    const handleClick = () => {
        // 👇 We redirect the click event onto the hidden input element
        hiddenFileInput.current?.click();
    };
    // Call a function (passed as a prop from the parent component)
    // to handle the user-selected file

    useEffect(
        () => {
            const { id: problemId } = currentProblem || {};
            if (isNil(problemId)) {
                return;
            }

            // eslint-disable-next-line prefer-destructuring
            const fileTest = problemSubmissionCode[problemId];
            if (isNil(fileTest) || fileTest instanceof String) {
                return;
            }

            setFile(fileTest as Blob);
            console.log(fileTest);
            console.log(file);
        },
        [ file, currentProblem, problemSubmissionCode ],
    );
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { target: { files: eventTarget } } = event;
        if (!eventTarget) {
            return;
        }

        updateSubmissionCode(eventTarget[0]);
    };
    return (
        <>
            <Button
              onClick={handleClick}
              type={ButtonType.secondary}
              size={ButtonSize.medium}
            />
            <input
              type="file"
              ref={hiddenFileInput}
              onChange={handleChange}
              style={{ display: 'none' }}
            />
        </>
    );
};

export default FileUploader;
