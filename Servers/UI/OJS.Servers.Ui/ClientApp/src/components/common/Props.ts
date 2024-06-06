import { ReactNode } from 'react';
import { Params } from 'react-router';

type ClassNameType = string | string[];

interface IHaveChildrenProps {
    children: ReactNode;
}

interface IHaveOptionalChildrenProps {
    children?: ReactNode;
}

interface IHaveChildrenPropsWithTitle {
    children: ReactNode;
    title?: string | ((params: Params<string>) => string);
}

interface IHaveOptionalClassName {
    className?: ClassNameType;
}

interface IPagesInfo {
    itemsPerPage: number;
    pageNumber: number;
    totalItemsCount: number;
    pagesCount: number;
}

export type {
    IHaveChildrenProps,
    IHaveOptionalChildrenProps,
    IHaveChildrenPropsWithTitle,
    IHaveOptionalClassName,
    ClassNameType,
    IPagesInfo,
};
