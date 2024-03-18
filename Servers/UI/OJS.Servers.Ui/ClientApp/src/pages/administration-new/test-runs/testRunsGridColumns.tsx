/* eslint-disable @typescript-eslint/ban-types */
import { Link } from 'react-router-dom';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { SubmissionResultType } from '../../../common/constants';
import { IEnumType } from '../../../common/types';
import IconSize from '../../../components/guidelines/icons/common/icon-sizes';
import ErrorIcon from '../../../components/guidelines/icons/ErrorIcon';
import MemoryIcon from '../../../components/guidelines/icons/MemoryIcon';
import RuntimeErrorIcon from '../../../components/guidelines/icons/RuntimeErrorIcon';
import TickIcon from '../../../components/guidelines/icons/TickIcon';
import TimeLimitIcon from '../../../components/guidelines/icons/TimeLimitIcon';
import WrongAnswerIcon from '../../../components/guidelines/icons/WrongAnswerIcon';
import { getStringObjectKeys } from '../../../utils/object-utils';

const testRunsFilterableColumns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'Id',
        flex: 1,
        type: 'number',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
        valueFormatter: (params) => params.value.toString(),
    },
    {
        field: 'timeUsed',
        headerName: 'Time Used',
        flex: 1,
        type: 'number',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
    },
    {
        field: 'memoryUsed',
        headerName: 'Memory Used',
        flex: 1,
        type: 'number',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
    },
    {
        field: 'executionComment',
        headerName: 'Execution Comment',
        flex: 1,
        type: 'string',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
    },
    {
        field: 'checkerComment',
        headerName: 'Checker Comment',
        flex: 1,
        type: 'string',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
    },
    {
        field: 'resultType',
        headerName: 'Result Type',
        flex: 1,
        type: 'enum',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
        enumValues: getStringObjectKeys(SubmissionResultType),
        renderCell: (params: GridRenderCellParams) => {
            switch (params.row.resultType.toString().toLowerCase()) {
            case SubmissionResultType.CorrectAnswer: return <TickIcon size={IconSize.Large} />;
            case SubmissionResultType.WrongAnswer: return <WrongAnswerIcon size={IconSize.Large} />;
            case SubmissionResultType.MemoryLimit: return <MemoryIcon size={IconSize.Large} />;
            case SubmissionResultType.TimeLimit: return <TimeLimitIcon size={IconSize.Large} />;
            case SubmissionResultType.RunTimeError: return <RuntimeErrorIcon size={IconSize.Large} />;
            default: return (
                <ErrorIcon size={IconSize.Large} />
            );
            }
        },
    } as GridColDef & IEnumType,
    {
        field: 'submissionId',
        headerName: 'Submission Id',
        flex: 1,
        type: 'number',
        filterable: false,
        sortable: false,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params: GridRenderCellParams) => (
            <Link to={`/submissions/${params.row.submissionId}/details`} target="_blank">
                {params.row.submissionId}
            </Link>
        ),
    },
];

export default testRunsFilterableColumns;
