import { IContestAutocomplete } from '../../../common/types';

/* eslint-disable import/prefer-default-export */
 interface IProblemGroupAdministrationModel{
    id: number;
    orderBy: number;
    type: string;
    contest: IContestAutocomplete;
}

export type {
    IProblemGroupAdministrationModel,
};
