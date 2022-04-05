import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useSubmissionsDetails } from '../../../hooks/submissions/use-submissions-details';
import { ISubmissionResultType } from '../../../hooks/submissions/types';
import { formatDate } from '../../../utils/dates';

interface ISubmissionResultsProps {
    problemId?: number,
}

const getResultText = (submissionResult: ISubmissionResultType) => (
    submissionResult.isProcessed
        ? `${submissionResult.points}/${submissionResult.maximumPoints}`
        : 'Not processed yet.');

const columns: GridColDef[] = [
    { field: 'id', headerName: '№', flex: 0.5 },
    {
        field: 'submittedOn',
        headerName: 'Submitted On',
        flex: 1,
        sortable: true,
        valueGetter: (params: GridValueGetterParams) => `${formatDate(new Date(params.row.createdOn))}`,
    },
    {
        field: 'result',
        headerName: 'Result',
        type: 'string',
        flex: 1,
        sortable: true,
        valueGetter: (params: GridValueGetterParams) => getResultText(params.row as ISubmissionResultType),
    },
];

const SubmissionResults = ({ problemId }: ISubmissionResultsProps) => {
    const { currentProblemSubmissionResults, getSubmissionResults } = useSubmissionsDetails();

    const getResults = useCallback(async () => {
        if (problemId != null) {
            await getSubmissionResults(problemId);
        }
    }, [ getSubmissionResults, problemId ]);

    useEffect(() => {
        (async () => {
            await getResults();
        })();
    }, [ getResults ]);

    return (
        currentProblemSubmissionResults.length === 0
            ? <p> No results for this problem yet.</p>
            : (
                <div style={{ height: 300, width: '100%' }}>
                    <DataGrid
                      rows={currentProblemSubmissionResults}
                      columns={columns}
                      pageSize={5}
                      rowsPerPageOptions={[ 5 ]}
                      disableSelectionOnClick
                    />
                </div>
            )
    );
};

export default SubmissionResults;
