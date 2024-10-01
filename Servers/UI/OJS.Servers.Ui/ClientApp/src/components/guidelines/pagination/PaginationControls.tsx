import makeStyles from '@material-ui/core/styles/makeStyles';
import Pagination from '@mui/material/Pagination';
import useTheme from 'src/hooks/use-theme';

import { PAGE_BOUNDARY_COUNT, PAGE_SIBLING_COUNT } from '../../../common/constants';
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
    const { themeColors, getColorClassName } = useTheme();

    const paginationClassNames = concatClassNames(
        styles.paginationControlsMenu,
        getColorClassName(themeColors.textColor),
        className,
    );

    const useStyles = makeStyles(() => ({
        ul: {
            // This sets the background color of the selected page button
            '& .MuiPaginationItem-root.Mui-selected': { backgroundColor: '#44a9f8' },
            '& .MuiPaginationItem-root': { color: themeColors.textColor },
        },
    }));

    const classes = useStyles();

    return count > 1
        ? (
            <Pagination
              count={count}
              siblingCount={PAGE_SIBLING_COUNT}
              boundaryCount={PAGE_BOUNDARY_COUNT}
              onChange={(ev, value) => {
                  onChange(value);
              }}
              page={page}
              className={paginationClassNames}
              classes={{ ul: classes.ul }}
              showFirstButton
              showLastButton
            />
        )
        : null;
};

export default PaginationControls;
