/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/ban-types */
import React, { useCallback, useEffect, useState } from 'react';
import { SiPicardsurgeles } from 'react-icons/all';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography,
} from '@mui/material';
import { CANCEL } from 'src/common/labels';

import styles from "src/components/guidelines/dialog/ConfirmDialog.module.scss";
import { IIndexProblemsType, IPagedResultType, IProblemRetestValidationType } from '../../../../common/types';
import { useRetestByIdMutation } from '../../../../redux/services/admin/problemsAdminService';
import { getAndSetExceptionMessage } from '../../../../utils/messages-utils';
import { renderErrorMessagesAlert } from '../../../../utils/render-utils';
import ConfirmDialogWithAdditionalProtection from '../../../guidelines/dialog/dialog-with-additional-protection/ConfirmDialogWithAdditionalProtection';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';


interface IProblemRetestProps {
    index: number;
    problemName: string | undefined;
    declineFunction: () => void;

    isValidationLoading: boolean;
    validationModel?: IProblemRetestValidationType;

    onSuccess: (message: string) => void;

    contestId:number;
    problemData: IPagedResultType<IIndexProblemsType> | undefined;

    problemToRetest: number;

}
const ProblemRetest = (props: IProblemRetestProps) => {
    const {
        index,
        problemName,
        declineFunction,
        isValidationLoading,
        validationModel,
        onSuccess,
        contestId,
        problemData,
        problemToRetest,
    } = props;

    const [ errorMessages, setErrorMessages ] = useState <Array<string>>([]);

    const [ retestById,
        {
            data: retestData,
            isSuccess: isSuccesfullyRetested,
            isLoading: isRetesting,
            error: retestError,
        } ] = useRetestByIdMutation();

    useEffect(() => {
        getAndSetExceptionMessage([ retestError ], setErrorMessages);
    }, [ retestError ]);

    useEffect(() => {
        if (isSuccesfullyRetested && onSuccess && retestData) {
            onSuccess(retestData);
        }
    }, [ isSuccesfullyRetested, onSuccess, retestData ]);

    const retestProblem = (currentProblemId: number) => {
        const currentProblem = problemData?.items?.find((x) => x.id === currentProblemId);
        if (currentProblem) {
            const problem = {
                id: currentProblemId,
                name: currentProblem.name,
                contestName: currentProblem.contest,
                contestId,
            };
            retestById(problem);
        }
    };

    if (isRetesting || isValidationLoading) {
        <SpinningLoader />;
    }

    const dialogTitle = `Retest ${problemName}`;

    const retestAllowedMessage = `You are about to retest ${validationModel?.submissionsCount} submissions
        with an average execution time of ${validationModel?.averageExecutionTime} seconds.
        This will impact the execution of other submissions during the time it takes
        for the submissions to be processed. Are you sure you want to proceed?`;

    const renderLoadingDialog = useCallback(() => (
        <div className={styles.position}>
            <Dialog
              open
              onClose={() => {}}
              aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {dialogTitle}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Validating retest limits. Please wait.
                    </DialogContentText>
                    <SpinningLoader />
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => declineFunction()}>
                        {CANCEL}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    ), [ declineFunction, dialogTitle ]);

    const renderRetestNotAllowedDialog = useCallback(() => (
        <div className={styles.position}>
            <Dialog
              open
              onClose={() => {}}
              aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {dialogTitle}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Unable to retest
                        {' '}
                        {validationModel?.submissionsCount}
                        {' '}
                        submissions for this problem. Contact a developer for this action.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => declineFunction()}>
                        {CANCEL}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    ), [ declineFunction, dialogTitle, validationModel ]);

    return (
        <>
            {renderErrorMessagesAlert(errorMessages)}
            {
                isValidationLoading
                    ? renderLoadingDialog()
                    : validationModel?.retestAllowed
                        ? (
                            <ConfirmDialogWithAdditionalProtection
                              key={index}
                              text={retestAllowedMessage}
                              title={dialogTitle}
                              passWordToMatch="Retest"
                              confirmButtonText="Retest"
                              declineFunction={() => declineFunction()}
                              confirmFunction={() => retestProblem(problemToRetest)}
                            />
                        )
                        : renderRetestNotAllowedDialog()
            }
        </>
    );
};

export default ProblemRetest;
