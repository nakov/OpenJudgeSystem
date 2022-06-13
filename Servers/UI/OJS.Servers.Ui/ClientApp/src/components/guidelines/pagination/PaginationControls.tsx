import React from 'react';
import Pagination from '@mui/material/Pagination';
import { IHaveOptionalClassName } from '../../common/Props';

import styles from './PaginationControls.module.scss';
import concatClassNames from '../../../utils/class-names';

interface IPaginationControlsProps extends IHaveOptionalClassName {
    count: number,
    onChange: (value: number) => void | undefined,
}

const PaginationControls = ({
    count,
    onChange,
    className = '',
} : IPaginationControlsProps) => {
    const paginationClassNames = concatClassNames(styles.paginationControlsMenu, className);

    return (
        <Pagination
          count={count}
          onChange={(ev, value) => onChange(value)}
          className={paginationClassNames}
        />
    );
};

export default PaginationControls;
