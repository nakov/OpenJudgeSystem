import * as React from 'react';
import { FC } from 'react';
import IHaveChildrenProps from '../../components/common/IHaveChildrenProps';

interface IPrivatePageProps extends IHaveChildrenProps {
}

const PrivatePage = ({ children }: IPrivatePageProps) => (
    <>
        {children}
    </>
);
const makePrivate = (ComponentToWrap: FC) => (props: any) => (
    <PrivatePage>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <ComponentToWrap {...props} />
    </PrivatePage>
);

export default PrivatePage;
export {
    makePrivate,
};
