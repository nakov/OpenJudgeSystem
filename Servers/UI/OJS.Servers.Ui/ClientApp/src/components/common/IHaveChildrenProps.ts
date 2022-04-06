import { ReactNode } from 'react';

interface IHaveChildrenProps {
    children: ReactNode,
}

interface IHaveOptionalChildrenProps {
    children?: ReactNode,
}

export type {
    IHaveChildrenProps,
    IHaveOptionalChildrenProps,
};

export default IHaveChildrenProps;
