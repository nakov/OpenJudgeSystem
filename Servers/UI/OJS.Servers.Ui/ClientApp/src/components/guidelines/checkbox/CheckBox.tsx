import { ChangeEvent, useState } from 'react';

import styles from './CheckBox.module.scss';

interface ICheckBoxProps {
    id: string;
    label?: string;
    /**
     * The initial state of the checkbox.
     * Defaults to false if not provided.
     */
    initialChecked?: boolean;
    /**
     * Callback function that is called whenever the checkbox value changes.
     * Receives the new checked value (true/false) as its parameter.
     */
    onChange: (checked: boolean) => void;
}

const CheckBox = ({
    id,
    label,
    initialChecked = false,
    onChange,
} : ICheckBoxProps) => {
    const [ isChecked, setIsChecked ] = useState(initialChecked);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newChecked = event.target.checked;
        setIsChecked(newChecked);
        onChange(newChecked);
    };

    return (
        <div className={styles.checkBoxWrapper}>
            <input type="checkbox" checked={isChecked} onChange={handleChange} id={id} />
            <label htmlFor={id}>{label}</label>
        </div>
    );
};

export default CheckBox;
