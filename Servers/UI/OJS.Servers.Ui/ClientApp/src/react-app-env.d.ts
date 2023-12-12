/* eslint-disable import/no-unused-modules */

/// <reference types="react-scripts" />
declare module '*.css';

declare module '*.svg?react' {
    import * as React from 'react';

    // eslint-disable-next-line import/group-exports
    export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;

    // eslint-disable-next-line import/group-exports
    export default ReactComponent;
}
