import makeStyles from '@material-ui/core/styles/makeStyles';
import Pagination from '@mui/material/Pagination';

import { PAGE_BOUNDARY_COUNT, PAGE_SIBLING_COUNT } from '../../../common/constants';
import concatClassNames from '../../../utils/class-names';
import { IHaveOptionalClassName } from '../../common/Props';

import styles from './PaginationControls.module.scss';

interface IPaginationControlsProps extends IHaveOptionalClassName {
    count: number;
    page: number;
    onChange: (value: number) => void | undefined;
    shouldScrollDown? : boolean;
}

const PaginationControls = ({
    count,
    page,
    onChange,
    className = '',
    shouldScrollDown = false,
} : IPaginationControlsProps) => {
    const paginationClassNames = concatClassNames(styles.paginationControlsMenu, className);

    const useStyles = makeStyles(() => ({
        ul: {
            // This sets the background color of the selected page button
            '& .MuiPaginationItem-root.Mui-selected': { backgroundColor: '#44a9f8' },
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
                  if (shouldScrollDown) {
                      setTimeout(() => {
                          window.scrollTo({
                              top: (ev as any).pageY - 800,
                              behavior: 'smooth',
                          });
                      }, 10);
                  }
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
