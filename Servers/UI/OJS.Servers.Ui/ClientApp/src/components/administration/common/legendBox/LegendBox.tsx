/* eslint-disable import/exports-last */
/* eslint-disable import/no-unused-modules */
import React from 'react';
import { Box } from '@mui/material';

import styles from './LegendBox.module.scss';

interface ILegendBoxProps {
    deletedMessage?: string;
    visibleMessage?: string;
}

const LegendBox = (props: ILegendBoxProps) => {
    const { deletedMessage, visibleMessage } = props;
    return (
        <Box className={styles.legendBox}>
            {deletedMessage && (
            <Box className={styles.rowColorBox}>
                <Box className={`${styles.colorBox} ${styles.deleted}`} />
                <p className={styles.colorSeparator}>-</p>
                <p>{deletedMessage}</p>
            </Box>
            )}
            {visibleMessage && (
            <Box className={styles.rowColorBox}>
                <Box className={`${styles.colorBox} ${styles.visible}`} />
                <p className={styles.colorSeparator}>-</p>
                <p>{visibleMessage}</p>
            </Box>
            )}
        </Box>
    );
};

export default LegendBox;
