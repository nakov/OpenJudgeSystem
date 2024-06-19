import { getContestSubmissionPageUrl } from '../../../common/urls/compose-client-urls';
import useNavigation from '../../../hooks/common/use-routing';
import { setSelectedContestDetailsProblem } from '../../../redux/features/contestsSlice';
import { useAppDispatch } from '../../../redux/store';
import Button, { ButtonSize, ButtonState } from '../../guidelines/buttons/Button';

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
    const dispatch = useAppDispatch();

    const { navigateInNewWindow } = useNavigation();

    const onButtonClick = async () => {
        dispatch(setSelectedContestDetailsProblem({ selectedProblem: null }));
        if (onClick) {
            onClick();
            return;
        }

        navigateInNewWindow(getContestSubmissionPageUrl(isCompete, id, problemId));
    };

    const btnText = isCompete
        ? COMPETE_STRING
        : PRACTICE_STRING;

    return (
        <Button
          text={btnText}
          state={isDisabled
              ? ButtonState.disabled
              : ButtonState.enabled}
          size={ButtonSize.small}
          isCompete={isCompete}
          onClick={onButtonClick}
        />
    );
};

export default ContestButton;
