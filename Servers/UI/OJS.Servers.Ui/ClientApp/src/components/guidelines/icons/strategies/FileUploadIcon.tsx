import React, { memo } from 'react';
import { AiOutlineUpload } from 'react-icons/ai';
import IconSize from '../common/icon-sizes';
import Icon, { IIconProps } from '../Icon';
import concatClassNames from '../../../../utils/class-names';
import styles from './StrategyIcon.module.scss';

interface IFileUploadIconProps extends IIconProps {
}


const FileUploadIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}: IFileUploadIconProps) => (
    <Icon
        className={concatClassNames(styles.icon, className)}
        size={size}
        helperText={helperText}
        Component={AiOutlineUpload}
    />
);

export default memo(FileUploadIcon);
