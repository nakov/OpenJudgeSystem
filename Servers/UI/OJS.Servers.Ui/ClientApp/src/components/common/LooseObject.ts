import { Anything } from '../../common/common-types';

interface ILooseObject {
    [key: string]: Anything;
}

export default ILooseObject;

export type {
    ILooseObject,
};
