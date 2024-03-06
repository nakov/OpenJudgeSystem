/* eslint-disable @typescript-eslint/ban-types */
import { MdOutlineRemoveCircle } from 'react-icons/md';
import { FormControl, FormGroup, FormLabel, IconButton, TextareaAutosize, TextField } from '@mui/material';

import { NAME, SOLUTION_SKELETON } from '../../../../common/labels';
import { SOLUTION_SKELETON_PLACEHOLDER } from '../../../../common/messages';
import { IProblemSubmissionType } from '../../../../common/types';

interface IProblemSUbmissionTypesProps{
    onSkeletonChange: Function;
    onStrategyRemoved: Function;
    strategy: IProblemSubmissionType;
}

const ProblemSubmissionTypes = (props: IProblemSUbmissionTypesProps) => {
    const { onSkeletonChange, onStrategyRemoved, strategy } = props;
    return (
        <FormGroup
          sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              margin: '1rem',
              alignSelf: 'flex-start',
              width: '85%',
          }}
          key={strategy.id}
        >
            <IconButton
              sx={{ width: '5%' }}
              onClick={() => onStrategyRemoved(strategy.id)}
            >
                <MdOutlineRemoveCircle color="red" />
            </IconButton>
            <FormControl sx={{ width: '25%' }}>
                <TextField
                  variant="standard"
                  label={NAME}
                  value={strategy.name}
                  InputLabelProps={{ shrink: true }}
                  type="text"
                  InputProps={{ readOnly: true }}
                />
            </FormControl>
            <FormControl sx={{ width: '60%' }}>
                <FormLabel>{SOLUTION_SKELETON}</FormLabel>
                <TextareaAutosize
                  placeholder={SOLUTION_SKELETON_PLACEHOLDER}
                  minRows={10}
                  maxRows={20}
                  value={strategy.solutionSkeleton ?? ''}
                  name="description"
                  onChange={(e) => onSkeletonChange(e.target.value, strategy.id)}
                />
            </FormControl>
        </FormGroup>
    );
};
export default ProblemSubmissionTypes;
