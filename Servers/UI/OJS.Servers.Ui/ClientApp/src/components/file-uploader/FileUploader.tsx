import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MdAttachFile } from 'react-icons/md';
import isNil from 'lodash/isNil';

import { FileValidationError } from '../../common/constants';
import { useSubmissions } from '../../hooks/submissions/use-submissions';
import { IErrorDataType } from '../../hooks/use-http';
import useTheme from '../../hooks/use-theme';
import Button, { ButtonSize, ButtonType } from '../guidelines/buttons/Button';

import styles from './FileUploader.module.scss';

interface IFileUploaderProps {
    file?: File | null;
    problemId?: number;
    allowedFileExtensions: string[];
    onInvalidFileExtension: (error: IErrorDataType) => void;
    onFileUpload: (file: File) => void;
}

const FileUploader = ({ file, problemId, allowedFileExtensions, onInvalidFileExtension, onFileUpload }: IFileUploaderProps) => {
    const { isDarkMode } = useTheme();
    const hiddenFileInput = useRef<HTMLInputElement | null>(null);
    const { actions: { updateSubmissionCode, closeErrorMessage } } = useSubmissions();

    const [ internalFile, setInternalFile ] = useState<File | null>(null);
    const [ internalProblemId, setInternalProblemId ] = useState<number | null>(null);
    const [ isDragOver, setIsDragOver ] = useState<boolean>(false);

    useEffect(() => {
        if (problemId !== internalProblemId && isNil(file)) {
            setInternalFile(null);
            return;
        }

        if (!isNil(file) && !isNil(problemId)) {
            setInternalFile(file);
            setInternalProblemId(problemId);
        }
    }, [ file, internalFile, internalProblemId, problemId ]);

    const handleClick = () => {
        hiddenFileInput.current?.click();
    };

    const handleDragEnter = (e: any) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: any) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleFileUpload = useCallback((uploadedFile: any, isFromDrag = false) => {
        const processedUploadFile = isFromDrag
            ? uploadedFile[0]
            : uploadedFile;
        onFileUpload(processedUploadFile);
        const extension = processedUploadFile.name.split('.').pop();

        if (allowedFileExtensions && !allowedFileExtensions.includes(extension)) {
            onInvalidFileExtension({
                detail: FileValidationError,
                extensions: { Data: JSON.stringify({ ProblemId: problemId }) },
            } as unknown as IErrorDataType);
        } else if (problemId) {
            closeErrorMessage(problemId.toString());
        }
        setInternalFile(processedUploadFile);
        updateSubmissionCode(processedUploadFile);
        if (problemId) {
            setInternalProblemId(problemId);
        }
    }, [ allowedFileExtensions, closeErrorMessage, onFileUpload, onInvalidFileExtension, problemId, updateSubmissionCode ]);

    const handleDrop = (e: any) => {
        e.preventDefault();
        setIsDragOver(false);
        const draggedFile = Array.from(e.dataTransfer.files);
        handleFileUpload(draggedFile, true);
    };

    const handleChange = useCallback(
        (event: any) => {
            const { target: { files: eventTarget } } = event;
            if (!eventTarget || isNil(problemId)) {
                return;
            }

            const uploadedFile = eventTarget[0];
            handleFileUpload(uploadedFile);
            // eslint-disable-next-line no-param-reassign
            event.target.value = null;
        },
        [ problemId, handleFileUpload ],
    );

    return (
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
            <div className={styles.fileUploadContainer}>
                <Button
                  onClick={handleClick}
                  type={isDarkMode
                      ? ButtonType.lightNeutral
                      : ButtonType.darkNeutral}
                  size={ButtonSize.medium}
                >
                    {isDragOver
                        ? 'Drop file here'
                        : 'Upload file'}
                </Button>
            </div>

            <div className={styles.fileName}>
                {isNil(internalFile)
                    ? ''
                    : (
                        <div className={styles.uploadedFileWrapper}>
                            <MdAttachFile />
                            {internalFile.name}
                        </div>
                    )}
            </div>
            <input
              type="file"
              ref={hiddenFileInput}
              onChange={handleChange}
              style={{ display: 'none' }}
            />
        </div>
    );
};

export default FileUploader;
