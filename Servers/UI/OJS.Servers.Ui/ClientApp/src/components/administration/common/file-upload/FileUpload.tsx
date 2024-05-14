/* eslint-disable @typescript-eslint/ban-types */
import { FaFileUpload } from 'react-icons/fa';
import { MdOutlineRemoveCircle } from 'react-icons/md';
import { Button, FormControl, FormGroup, IconButton, styled, Tooltip, Typography } from '@mui/material';

import { CLEAR_SELECTION } from '../../../../common/messages';

interface IFileUploadProps {
    handleFileUpload: Function;
    propName: string;
    setSkipDownload: Function;
    showDownloadButton: boolean;
    uploadButtonName?: string;
    onClearSelectionClicked: Function;
    buttonLabel?: string;
    disableClearButton: boolean;
}
const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});
const FileUpload = (props: IFileUploadProps) => {
    const {
        handleFileUpload,
        propName,
        setSkipDownload,
        showDownloadButton,
        uploadButtonName,
        onClearSelectionClicked,
        disableClearButton,
        buttonLabel = 'Upload',
    } = props;
    return (
        <FormGroup
          sx={{
              display: 'flex',
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              margin: '1rem 0',
          }}
        >
            <FormControl sx={{ margin: '1rem' }}>
                <Tooltip title={CLEAR_SELECTION}>
                    <span>
                        <IconButton onClick={() => onClearSelectionClicked(propName)} disabled={disableClearButton}>
                            <MdOutlineRemoveCircle color={disableClearButton
                                ? 'grey'
                                : 'red'}
                            />
                        </IconButton>
                    </span>
                </Tooltip>
            </FormControl>
            <FormControl sx={{ margin: '1rem' }}>
                <Button
                  sx={{ width: '200px' }}
                  component="label"
                  variant="contained"
                  startIcon={<FaFileUpload />}
                  onChange={(e) => handleFileUpload(e, propName)}
                >
                    {buttonLabel}
                    <VisuallyHiddenInput type="file" />
                </Button>
                <Typography variant="caption">
                    {' '}
                    {uploadButtonName}
                </Typography>
            </FormControl>
            {showDownloadButton && (
            <FormControl sx={{ margin: '1rem' }}>
                <Button
                  sx={{ width: '200px' }}
                  variant="contained"
                  onClick={() => setSkipDownload(false)}
                >
                    Download
                </Button>
            </FormControl>
            )}
        </FormGroup>
    );
};
export default FileUpload;
