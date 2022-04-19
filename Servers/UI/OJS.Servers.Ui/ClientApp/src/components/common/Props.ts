import { ReactNode } from 'react';

type ClassNameType = string | string[];

interface IHaveChildrenProps {
    children: ReactNode;
}

interface IHaveOptionalChildrenProps {
    children?: ReactNode;
}

interface IHaveOptionalClassName {
    className?: ClassNameType;
}

export type {
    IHaveChildrenProps,
    IHaveOptionalChildrenProps,
    IHaveOptionalClassName,
    ClassNameType,
};
