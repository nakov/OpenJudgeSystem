import * as React from 'react';

interface IHaveChildrenProps {
    children: React.ReactNode,
}

interface IHaveOptionalChildrenProps {
    children?: React.ReactNode,
}

export type {
    IHaveChildrenProps,
    IHaveOptionalChildrenProps,
};

export default IHaveChildrenProps;
