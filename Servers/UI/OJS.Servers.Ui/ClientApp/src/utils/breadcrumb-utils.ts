import
{
    BreadcrumbItemNameMaxLength,
    BreadcrumbItemNameMaxShorteningPercentage,
    BreadcrumbItemNameMinLength,
    BreadcrumbItemNameMinShorteningPercentage,
    Elipsis,
    MaxBreadcrumbsStringLength,
} from '../common/constants';
import { ContestBreadcrumb } from '../common/contest-types';

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

const trimBreadcrumbItems = (breadcrumbItems: Array<ContestBreadcrumb>): Array<ContestBreadcrumb> => {
    // eslint-disable-next-line linebreak-style
    let breadcrumbItemsStringLength = breadcrumbItems?.reduce((acc, curr) => acc + curr.name.length, 0);

    return [ ...breadcrumbItems ].reverse().reduce((acc: Array<ContestBreadcrumb>, breadcrumbItem) => {
        const symbolCountToBeRemoved = calculateBreadcrumbNameSymbolCountToBeRemoved(breadcrumbItem.name.length);
        let newName;

        if (breadcrumbItemsStringLength > MaxBreadcrumbsStringLength) {
            const removalLength = breadcrumbItemsStringLength - MaxBreadcrumbsStringLength > symbolCountToBeRemoved
                ? symbolCountToBeRemoved
                : breadcrumbItemsStringLength - MaxBreadcrumbsStringLength;

            newName = `${breadcrumbItem.name.substring(0, Math.max(0, breadcrumbItem.name.length - removalLength))}${Elipsis}`;

            breadcrumbItemsStringLength -= breadcrumbItem.name.length - newName.length + Elipsis.length;
        } else {
            newName = breadcrumbItem.name;
            breadcrumbItemsStringLength -= breadcrumbItem.name.length;
        }

        acc.push({
            id: breadcrumbItem.id,
            name: newName,
        });

        return acc;
    }, []).reverse();
};

export default trimBreadcrumbItems;
