/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';

import { useDeleteProblemMutation } from '../../../../redux/services/admin/problemsAdminService';
import { Alert, AlertHorizontalOrientation, AlertSeverity, AlertVariant, AlertVerticalOrientation } from '../../../guidelines/alert/Alert';
import ConfirmDialog from '../../../guidelines/dialog/ConfirmDialog';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';

interface IProblemDeleteButtonProps {
    onSuccess?: () => void;
    problemId: number;
    problemName: string;
    style?: object;
}
const DeleteProblem = (props: IProblemDeleteButtonProps) => {
    const { onSuccess, problemId, problemName, style } = props;
    const [ showConfirmDelete, setShowConfirmDelete ] = useState<boolean>(false);
    const [ message, setMessage ] = useState<string | null>(null);

    const [ deleteProblem, { data, isLoading, isSuccess, error } ] = useDeleteProblemMutation();

    const confirmDeleteContest = () => {
        setShowConfirmDelete(!showConfirmDelete);
    };

    useEffect(() => {
        if (error && !isSuccess) {
            // The data by default is of type unknown
            setMessage(error.data as string);
        } else if (isSuccess) {
            setMessage(data as string);
            if (onSuccess) {
                onSuccess();
            }
        } else {
            setMessage(null);
        }
    }, [ data, error, isSuccess, onSuccess ]);

    return (
        isLoading
            ? <SpinningLoader />
            : (
                <div style={style
                    ? { ...style }
                    : {}}
                >
                    { message && (
                    <Alert
                      variant={AlertVariant.Filled}
                      vertical={AlertVerticalOrientation.Top}
                      horizontal={AlertHorizontalOrientation.Right}
                      severity={error
                          ? AlertSeverity.Error
                          : AlertSeverity.Success}
                      message={message}
                    />
                    )}
                    <IconButton onClick={confirmDeleteContest}>
                        <DeleteIcon color="error">Delete</DeleteIcon>
                    </IconButton>
                    {showConfirmDelete && (
                    <ConfirmDialog
                      title={`Delete: ${problemName}`}
                      text={`Are you sure that you want to delete problem: ${problemName}`}
                      confirmButtonText="Delete"
                      declineButtonText="Cancel"
                      onClose={() => setShowConfirmDelete(!showConfirmDelete)}
                      confirmFunction={() => deleteProblem({ id: Number(problemId) })}
                    />
                    )}
                </div>
            )
    );
};

export default DeleteProblem;
