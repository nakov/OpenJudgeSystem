import React, { useMemo } from 'react';

import generateId from '../../../utils/id-generator';
import Button from '../../guidelines/buttons/Button';

import styles from './SubmissionStateLink.module.scss';

interface ISubmissionStateLinkProps {
    stateIndex: number;
    isSelected: boolean;
    text: string;
    handleOnSelect: (index: number) => void;
}

const SubmissionStateLink = ({ stateIndex, isSelected, text, handleOnSelect }: ISubmissionStateLinkProps) => {
    const btnId = useMemo(
        () => {
            const privilegedIdBtn = generateId();
            return `btn-submit-${privilegedIdBtn}`;
        },
        [],
    );

    return (
        <Button
          id={btnId}
          onClick={() => handleOnSelect(stateIndex)}
          internalClassName={`${styles.privilegedButtonClassName} 
                              ${isSelected
              ? `${styles.active}`
              : ''}
                             `}
          text={text}
        />
    );
};

export default SubmissionStateLink;
