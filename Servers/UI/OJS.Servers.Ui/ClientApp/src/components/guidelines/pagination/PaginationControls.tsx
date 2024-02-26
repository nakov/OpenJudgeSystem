import React from 'react';
import Pagination from '@mui/material/Pagination';

import { PAGE_BOUNDARY_COUNT, PAGE_SIBLING_COUNT } from '../../../common/constants';
import useTheme from '../../../hooks/use-theme';
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
    const { themeColors, mode } = useTheme();

    return (
        <Pagination
          sx={{
              '& .Mui-selected': { backgroundColor: '#44a9f8' },
              '& .MuiPaginationItem-root': {
                  color: themeColors.textColor,
                  borderRadius: '10%',
                  '&:hover': {
                      backgroundColor: mode === 'dark'
                          ? '#44a9f8'
                          : '#cbcbcb',
                      color: themeColors.textColor,
                  },
              },
          }}
          count={count}
          siblingCount={PAGE_SIBLING_COUNT}
          boundaryCount={PAGE_BOUNDARY_COUNT}
          onChange={(ev, value) => onChange(value)}
          page={page}
          className={`${styles.paginationControlsMenu} ${className}`}
          showFirstButton
          showLastButton
        />
    );
};

export default PaginationControls;
