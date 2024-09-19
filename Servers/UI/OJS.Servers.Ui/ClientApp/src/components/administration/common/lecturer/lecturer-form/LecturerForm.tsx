/* eslint-disable @typescript-eslint/ban-types */
import { Autocomplete, FormControl, MenuItem, TextField, Typography } from '@mui/material';

import FormActionButton from '../../../form-action-button/FormActionButton';

// eslint-disable-next-line css-modules/no-unused-class
import formStyles from '../../styles/FormStyles.module.scss';

interface ILecturerFormProps {
    onClick: Function;
    disabled: boolean;
    data: Array<any>;
    name: string;
    label: string;
    onChange: Function;
    onInputChange?: Function;
}

const LecturerForm = (props: ILecturerFormProps) => {
    const { onClick, disabled, data, name, label, onChange, onInputChange } = props;
    return (
        <form className={formStyles.form}>
            <Typography variant="h4" className="centralize">
                {name}
            </Typography>
            <FormControl className={formStyles.inputRow}>
                <Autocomplete
                  sx={{ width: '100%' }}
                  className={formStyles.inputRow}
                  onChange={(event, newValue) => onChange(newValue!)}
                  onInputChange={(event) => {
                      if (onInputChange) {
                          onInputChange(event);
                      }
                  }}
                  options={data!}
                  renderInput={(params) => <TextField {...params} label={label} key={params.id} />}
                  getOptionLabel={(option) => option?.name}
                  renderOption={(properties, option) => (
                      <MenuItem {...properties} key={option.id} value={option.id}>
                          {option.name}
                      </MenuItem>
                  )}
                />
            </FormControl>
            <FormActionButton
              disabled={disabled}
              className={formStyles.buttonsWrapper}
              buttonClassName={formStyles.button}
              onClick={() => onClick()}
              name="Add"
            />
        </form>
    );
};

export default LecturerForm;
