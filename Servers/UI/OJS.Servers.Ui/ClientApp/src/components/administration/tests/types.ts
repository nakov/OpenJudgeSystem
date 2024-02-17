/* eslint-disable import/prefer-default-export */
interface ITestAdministration{
    input: string;
    output: string;
    type: string;
    orderBy: number;
    retestProblem: boolean;
    hideInput: boolean;
}

interface ITestInListData {
    id:number;
    isTrialTest:boolean;
    isOpenTest:boolean;
    hideInput:boolean;
    orderBy:number;
    problemId:number;
    problemName:string;
}

export type { ITestAdministration, ITestInListData };
