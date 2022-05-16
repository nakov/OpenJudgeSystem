import React from 'react';
import Pagination from '@mui/material/Pagination'
import { IHaveOptionalClassName } from '../../common/Props'

import styles from './PaginationControls.module.scss';
import concatClassNames from '../../../utils/class-names';

interface IPaginationControlsProps extends IHaveOptionalClassName {
    count: number,
    onChange: (event: React.ChangeEvent<unknown>, value: number) => void | undefined,
}

const PaginationControls = ({
    count,
    onChange,
    className = '',
} : IPaginationControlsProps) => {
    const paginationClassNames = concatClassNames(styles.paginationControlsMenu, className);
    
    return <Pagination
        count={count}
        onChange={onChange}
        className={paginationClassNames}
    />
}

export default PaginationControls;
