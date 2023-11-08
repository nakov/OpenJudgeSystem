import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isNilOrEmpty = (value: any): boolean => isNil(value) || isEmpty(value);
export default isNilOrEmpty;
