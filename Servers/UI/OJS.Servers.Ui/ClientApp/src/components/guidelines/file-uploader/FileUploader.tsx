import React, { ChangeEvent, useRef, useState } from 'react';

import { useSubmissions } from '../../../hooks/submissions/use-submissions';
import { useProblems } from '../../../hooks/use-problems';
import Button, { ButtonSize, ButtonType } from '../buttons/Button';

const FileUploader = () => {
    // Create a reference to the hidden file input element
    const hiddenFileInput = useRef<HTMLInputElement | null>(null);
    const { state: { currentProblem } } = useProblems();
    const { actions: { updateSubmissionCode } } = useSubmissions();
    const [ fileName, setFileName ] = useState('');

    // Programatically click the hidden file input element
    // when the Button component is clicked
    const handleClick = () => {
        // 👇 We redirect the click event onto the hidden input element
        hiddenFileInput.current?.click();
    };
    // Call a function (passed as a prop from the parent component)
    // to handle the user-selected file
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { target: { files: eventTarget } } = event;
        if (!eventTarget) {
            return;
        }

        updateSubmissionCode(eventTarget[0]);
        setFileName(eventTarget[0].name);
    };
    return (
        <>
            <Button
              onClick={handleClick}
              type={ButtonType.secondary}
              size={ButtonSize.medium}
            >
                {currentProblem?.codeEditorCode
                    ? `${fileName}`
                    : 'Click to select'}
            </Button>
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
