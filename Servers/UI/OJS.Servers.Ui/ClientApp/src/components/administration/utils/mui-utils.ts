/* eslint-disable @typescript-eslint/ban-types */
const handleDateTimePickerChange = (name: string, newValue:any, onChange: Function) => {
    const event = {
        target: {
            name,
            value: newValue
                ? newValue.toString()
                : null,
        },
    };
    onChange(event);
};

const handleAutocompleteChange = <T extends { [key: string]: any }>(
    name: string,
    newValue: T,
    propertyToSet: string,
    onChange: (event: { target: { name: string; value: any } }) => void,
) => {
    const value = newValue[propertyToSet];
    if (value !== undefined) {
        const event = {
            target: {
                name,
                value,
            },
        };
        onChange(event);
    }
};

export {
    handleDateTimePickerChange,
    handleAutocompleteChange,
};
