import React from 'react';
import Pagination from '@mui/material/Pagination';

import { PageBoundaryCount, PageSiblingCount } from '../../../common/constants';
import concatClassNames from '../../../utils/class-names';
import { IHaveOptionalClassName } from '../../common/Props';

import styles from './PaginationControls.module.scss';

interface IPaginationControlsProps extends IHaveOptionalClassName {
    count: number;
    page: number;
    onChange: (value: number) => void | undefined;
}

const PaginationControls = ({
    count,
    page,
    onChange,
    className = '',
} : IPaginationControlsProps) => {
    const paginationClassNames = concatClassNames(styles.paginationControlsMenu, className);

    return (
        <Pagination
          count={count}
          siblingCount={PageSiblingCount}
          boundaryCount={PageBoundaryCount}
          onChange={(ev, value) => onChange(value)}
          page={page}
          className={paginationClassNames}
          showFirstButton
          showLastButton
        />
    );
};

export default PaginationControls;
