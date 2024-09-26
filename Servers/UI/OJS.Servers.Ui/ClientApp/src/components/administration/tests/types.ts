import { IDictionary } from '../../../common/common-types';

interface ITestAdministration {
    id: number;
    input: string;
    output: string;
    type: string;
    orderBy: number;
    retestProblem: boolean;
    hideInput: boolean;
    problemId: number;
    problemName: string;
}

interface ITestInListData {
    id: number;
    isTrialTest: boolean;
    isOpenTest: boolean;
    hideInput: boolean;
    orderBy: number;
    problemId: number;
    problemName: string;
    retestProblem: boolean;
    type: string;
}

const testTypesToFEStringsMapping = {
    Standard: 'Compete',
    Trial: 'Practice',
    Open: 'Open',
} as IDictionary<string>;

export { testTypesToFEStringsMapping };

export type { ITestAdministration, ITestInListData };
