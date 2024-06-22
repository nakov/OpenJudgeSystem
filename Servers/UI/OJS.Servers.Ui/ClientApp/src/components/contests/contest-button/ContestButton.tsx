import { useNavigate } from 'react-router-dom';

import { getContestSubmissionPageUrl } from '../../../common/urls/compose-client-urls';
import { setSelectedContestDetailsProblem } from '../../../redux/features/contestsSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import Button, { ButtonSize, ButtonState } from '../../guidelines/buttons/Button';

import styles from './ContestButton.module.scss';

interface IContestButtonProps {
    isCompete: boolean;
    isDisabled: boolean;
    id: number;
    problemId?: number;
    onClick?: () => void;
}

const COMPETE_STRING = 'COMPETE';
const PRACTICE_STRING = 'PRACTICE';

const ContestButton = (props: IContestButtonProps) => {
    const { isCompete, isDisabled, id, problemId, onClick } = props;
    const { internalUser } = useAppSelector((reduxState) => reduxState.authorization);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onButtonClick = async () => {
        dispatch(setSelectedContestDetailsProblem({ selectedProblem: null }));
        if (onClick) {
            onClick();
            return;
        }

        navigate(getContestSubmissionPageUrl(isCompete, id, problemId), { replace: true });
    };

    const isUserAdminOrLecturer = internalUser.isAdmin || internalUser.isLecturer;

    const btnText = isCompete
        ? COMPETE_STRING
        : PRACTICE_STRING;

    return (
        <Button
          text={btnText}
          state={!isUserAdminOrLecturer && isDisabled
              ? ButtonState.disabled
              : ButtonState.enabled}
          size={ButtonSize.small}
          isCompete={isCompete}
          onClick={onButtonClick}
          className={isUserAdminOrLecturer && isDisabled
              ? styles.adminDisabled
              : ''}
        />
    );
};

export default ContestButton;
