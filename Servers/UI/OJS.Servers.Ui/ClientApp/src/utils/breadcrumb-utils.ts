import { ContestBreadcrumb } from '../common/contest-types';

const BreadcrumbItemNameMinLength = 2;
const BreadcrumbItemNameMaxLength = 100;
const BreadcrumbItemNameMinShorteningPercentage = 0.2;
const BreadcrumbItemNameMaxShorteningPercentage = 0.6;
const Ellipsis = '...';

const calculateBreadcrumbNameSymbolCountToBeRemoved = (nameLength: number) => {
    /*
        The calculation is based on a linear interpolation from
        20% (BreadcrumbItemNameMinShorteningPercentage) to
        60% (BreadcrumbItemNameMaxShorteningPercentage).
    */
    const scale = (nameLength - BreadcrumbItemNameMinLength) / (BreadcrumbItemNameMaxLength - BreadcrumbItemNameMinLength);
    // eslint-disable-next-line max-len
    const adjustedPercentage = BreadcrumbItemNameMinShorteningPercentage + scale * (BreadcrumbItemNameMaxShorteningPercentage - BreadcrumbItemNameMinShorteningPercentage);

    return Math.round(nameLength * adjustedPercentage);
};

const trimBreadcrumbItems = (breadcrumbItems: Array<ContestBreadcrumb>, maxBreadcrumbsStringLength: number = 100)
    : Array<ContestBreadcrumb> => {
    let breadcrumbItemsStringLength = breadcrumbItems?.reduce((acc, curr) => acc + curr.name.length, 0);

    return breadcrumbItemsStringLength > maxBreadcrumbsStringLength
        ? [ ...breadcrumbItems ].reverse().reduce((acc: Array<ContestBreadcrumb>, breadcrumbItem) => {
            const symbolCountToBeRemoved = calculateBreadcrumbNameSymbolCountToBeRemoved(breadcrumbItem.name.length);
            let newName;

            if (breadcrumbItemsStringLength > maxBreadcrumbsStringLength) {
                const removalLength = breadcrumbItemsStringLength - maxBreadcrumbsStringLength > symbolCountToBeRemoved
                    ? symbolCountToBeRemoved
                    : breadcrumbItemsStringLength - maxBreadcrumbsStringLength;

                newName = `${breadcrumbItem.name.substring(0, Math.max(0, breadcrumbItem.name.length - removalLength))}${Ellipsis}`;

                breadcrumbItemsStringLength -= breadcrumbItem.name.length - newName.length + Ellipsis.length;
            } else {
                newName = breadcrumbItem.name;
                breadcrumbItemsStringLength -= breadcrumbItem.name.length;
            }

            acc.push({
                id: breadcrumbItem.id,
                name: newName,
            });

            return acc;
        }, []).reverse()
        : breadcrumbItems;
};

export default trimBreadcrumbItems;
