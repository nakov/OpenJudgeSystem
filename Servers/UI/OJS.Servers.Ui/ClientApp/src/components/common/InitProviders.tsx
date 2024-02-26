import React, { FC } from 'react';

import { Anything } from '../../common/common-types';

import { IHaveChildrenProps } from './Props';

interface IProvider {
    Provider: FC<IHaveChildrenProps>;
    props: Anything;
}

// A provider could be FC or IProvider when props are needed
type ProviderType = IProvider | FC;

interface IInitProviderProps extends IHaveChildrenProps {
    providers: ProviderType[];
}

const InitProviders = ({
    providers,
    children,
}: IInitProviderProps) => {
    // We need this disable for the dynamic providers initialization
    // eslint-disable-next-line react/jsx-no-useless-fragment
    const initial = (<>{children}</>);

    return providers
        .reverse()
        .reduce(
            (current, item) => {
                let Provider = item as FC<IHaveChildrenProps>;
                let props = {};
                const providerItem = item as IProvider;

                // Checking if provider is of type IProvider to pass props
                if (providerItem.Provider) {
                    // eslint-disable-next-line prefer-destructuring
                    Provider = providerItem.Provider;
                    // eslint-disable-next-line prefer-destructuring
                    props = providerItem.props;
                }

                return (
                    <Provider {...props}>
                        {current}
                    </Provider>
                );
            },
            initial,
        );
};

export default InitProviders;

export type {
    ProviderType,
};
