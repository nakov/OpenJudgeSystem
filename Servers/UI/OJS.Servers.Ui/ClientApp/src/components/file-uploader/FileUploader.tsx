import React, { useCallback, useEffect, useRef, useState } from 'react';
import isNil from 'lodash/isNil';

import { useSubmissions } from '../../hooks/submissions/use-submissions';
import Button, { ButtonSize, ButtonType } from '../guidelines/buttons/Button';

import styles from './FileUploader.module.scss';

interface IFileUploaderProps {
    file?: File | null;
    problemId?: number;
}

const FileUploader = ({ file, problemId }: IFileUploaderProps) => {
    const hiddenFileInput = useRef<HTMLInputElement | null>(null);
    const { actions: { updateSubmissionCode } } = useSubmissions();
    const [ internalFile, setInternalFile ] = useState<File | null>(null);
    const [ internalProblemId, setInternalProblemId ] = useState<number | null>(null);
    const handleClick = () => {
        hiddenFileInput.current?.click();
    };

    useEffect(
        () => {
            if (problemId !== internalProblemId && isNil(file)) {
                setInternalFile(null);
                return;
            }

            if (!isNil(file) && !isNil(problemId)) {
                setInternalFile(file);
                setInternalProblemId(problemId);
            }
        },
        [ file, internalFile, internalProblemId, problemId ],
    );

    const handleChange = useCallback(
        (event: any) => {
            const { target: { files: eventTarget } } = event;
            if (!eventTarget || isNil(problemId)) {
                return;
            }

            updateSubmissionCode(eventTarget[0]);
            setInternalFile(eventTarget[0]);
            setInternalProblemId(problemId);

            // eslint-disable-next-line no-param-reassign
            event.target.value = null;
        },
        [ updateSubmissionCode, problemId ],
    );

    return (
        <>
            <div className={styles.fileUploadContainer}>
                <Button
                  onClick={handleClick}
                  type={ButtonType.submit}
                  size={ButtonSize.medium}
                >
                    Click to select
                </Button>
                <div className={styles.fileName}>
                    {isNil(internalFile)
                        ? ''
                        : internalFile.name}
                </div>
            </div>
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
