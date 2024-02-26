/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/ban-types */
import React, { useEffect, useState } from 'react';

import { IIndexProblemsType, IPagedResultType } from '../../../../common/types';
import { useRetestByIdMutation } from '../../../../redux/services/admin/problemsAdminService';
import { getAndSetExceptionMessage } from '../../../../utils/messages-utils';
import { renderAlert } from '../../../../utils/render-utils';
import { AlertSeverity } from '../../../guidelines/alert/Alert';
import ConfirmDialogWithAdditionalProtection from '../../../guidelines/dialog/dialog-with-additional-protection/ConfirmDialogWithAdditionalProtection';
import SpinningLoader from '../../../guidelines/spinning-loader/SpinningLoader';

interface IProblemRetestProps {
    index: number;
    problemName: string | undefined;
    declineFunction: () => void;
    onSuccess: (message: string) => void;

    contestId:number;
    problemData: IPagedResultType<IIndexProblemsType> | undefined;

    problemToRetest: number;

}
const ProblemRetest = (props: IProblemRetestProps) => {
    const { index, problemName, declineFunction, onSuccess, contestId, problemData, problemToRetest } = props;

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

    if (isRetesting) {
        <SpinningLoader />;
    }
    return (
        <>
            {errorMessages.map((x: string, i:number) => renderAlert(x, AlertSeverity.Error, i))}
            <ConfirmDialogWithAdditionalProtection
              key={index}
              text={`Are you sure you want to retest all submissions for  ${problemName}`}
              title="Retest"
              passWordToMatch="Retest"
              confirmButtonText="Retest"
              declineFunction={() => declineFunction()}
              confirmFunction={() => retestProblem(problemToRetest)}
            />
        </>
    );
};

export default ProblemRetest;
