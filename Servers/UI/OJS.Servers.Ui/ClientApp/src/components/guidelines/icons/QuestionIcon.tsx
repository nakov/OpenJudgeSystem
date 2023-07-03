import React from 'react';
import { RiQuestionFill } from 'react-icons/ri';

import IconSize from './common/icon-sizes';
import Icon, { IIconProps } from './Icon';

type IQuestionIconProps = IIconProps

const QuestionIcon = ({
    className = '',
    size = IconSize.Medium,
    helperText = '',
}:IQuestionIconProps) => (
    <Icon
      className={className}
      size={size}
      helperText={helperText}
      Component={RiQuestionFill}
    />
);

export default QuestionIcon;
