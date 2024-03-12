import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '../../../redux/store';
import { getContestBtnUrlString } from '../../../utils/urls';
import Button, { ButtonSize, ButtonState } from '../../guidelines/buttons/Button';

interface IContestButtonProps {
    isCompete: boolean;
    isDisabled: boolean;
    id: number;
}

const COMPETE_STRING = 'COMPETE';
const PRACTICE_STRING = 'PRACTICE';

const ContestButton = (props: IContestButtonProps) => {
    const { isCompete, isDisabled, id } = props;

    const { isLoggedIn } = useAppSelector((state) => state.authorization);
    const navigate = useNavigate();

    const btnText = isCompete
        ? COMPETE_STRING
        : PRACTICE_STRING;
    const btnNavigateUrl = getContestBtnUrlString(isCompete, id);

    return (
        <Button
          text={btnText}
          state={isDisabled
              ? ButtonState.disabled
              : ButtonState.enabled}
          size={ButtonSize.small}
          isCompete={isCompete}
          onClick={() => {
              if (!isLoggedIn) {
                  navigate('/login');
                  return;
              }
              navigate(btnNavigateUrl!);
          }}
        />
    );
};

export default ContestButton;
