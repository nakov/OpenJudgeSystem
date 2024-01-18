/* eslint-disable @typescript-eslint/no-explicit-any */

const toList = (obj: any) => Object.keys(obj)
    .map((key) => ({ key, value: obj[key] }));

const flexCenterObjectStyles = { display: 'flex', justifyContent: 'center', alignItems: 'center' };
const modalStyles = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    height: '90%',
    bgcolor: 'background.paper',
    borderRadius: 3,
    boxShadow: '0px 0px 19px -4px rgba(0,0,0,0.75)',
    p: 4,
    fontFamily: 'Roboto, Helvetica , Arial',
    overflow: 'auto',
};
export default { toListOfKeyValue: toList };

export {
    toList,
    flexCenterObjectStyles,
    modalStyles,
};
