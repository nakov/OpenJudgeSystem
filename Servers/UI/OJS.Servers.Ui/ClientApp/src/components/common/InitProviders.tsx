import React, { FC } from 'react';

interface IProvider {
    Provider: FC,
    props?: any,
}

// A provider could be FC or IProvider when props are needed
type ProviderType = IProvider | FC;

interface IInitProviderProps {
    providers: ProviderType[],
    children: any,
}

const InitProviders = ({ providers, children } : IInitProviderProps) => {
    const initial = (<>{children}</>);

    return providers
        .reverse()
        .reduce(
            (current, item) => {
                let Provider = item as FC;
                let props = {};
                const providerItem = item as IProvider;

                // Checking if provider is of type IProvider to pass props
                if (providerItem.Provider) {
                    Provider = providerItem.Provider;
                    props = providerItem.props;
                }

                return (
                    // eslint-disable-next-line react/jsx-props-no-spreading
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
