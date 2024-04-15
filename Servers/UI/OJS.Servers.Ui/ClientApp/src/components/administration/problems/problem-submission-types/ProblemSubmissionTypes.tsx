/* eslint-disable @typescript-eslint/ban-types */
import { MdOutlineRemoveCircle } from 'react-icons/md';
import { FormControl, FormGroup, FormLabel, IconButton, TextareaAutosize, TextField } from '@mui/material';

import { MEMORY_LIMIT, NAME, SOLUTION_SKELETON, TIME_LIMIT } from '../../../../common/labels';
import { SOLUTION_SKELETON_PLACEHOLDER } from '../../../../common/messages';
import { IProblemSubmissionType } from '../../../../common/types';

import styles from './ProblemSubmissionTypes.module.scss';

interface IProblemSUbmissionTypesProps{
  onPropChange: Function;
    onStrategyRemoved: Function;
    strategy: IProblemSubmissionType;
}

const ProblemSubmissionTypes = (props: IProblemSUbmissionTypesProps) => {
    const { onPropChange, onStrategyRemoved, strategy } = props;
    return (
        <FormGroup
          sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              margin: '1rem',
              alignSelf: 'flex-start',
              minWidth: '95%',
              flexWrap: 'wrap',
          }}
          key={strategy.id}
        >
            <IconButton
              sx={{ width: '5%' }}
              onClick={() => onStrategyRemoved(strategy.id)}
            >
                <MdOutlineRemoveCircle color="red" />
            </IconButton>
            <FormControl className={styles.submissionTypeName}>
                <TextField
                  variant="standard"
                  label={NAME}
                  value={strategy.name}
                  InputLabelProps={{ shrink: true }}
                  type="text"
                  InputProps={{ readOnly: true }}
                />
            </FormControl>
            <FormControl className={styles.solutionSkeleton}>
                <FormLabel>{SOLUTION_SKELETON}</FormLabel>
                <TextareaAutosize
                  placeholder={SOLUTION_SKELETON_PLACEHOLDER}
                  minRows={5}
                  maxRows={5}
                  value={strategy.solutionSkeleton ?? ''}
                  name="skeleton"
                  onChange={(e) => onPropChange(e.target.value, strategy.id, 'solutionSkeleton')}
                />
            </FormControl>
            <FormGroup className={styles.limitsWrapper}>
                <TextField
                  variant="standard"
                  label={TIME_LIMIT}
                  value={strategy.timeLimit ?? ''}
                  InputLabelProps={{ shrink: true }}
                  name="timeLimit"
                  type="number"
                  className={styles.limitField}
                  onChange={(e) => onPropChange(e.target.value, strategy.id, 'timeLimit')}
                />
                <TextField
                  variant="standard"
                  label={MEMORY_LIMIT}
                  value={strategy.memoryLimit ?? ''}
                  InputLabelProps={{ shrink: true }}
                  type="number"
                  name="memoryLimit"
                  className={styles.limitField}
                  onChange={(e) => onPropChange(e.target.value, strategy.id, 'memoryLimit')}
                />
            </FormGroup>
        </FormGroup>
    );
};

export default ProblemSubmissionTypes;
