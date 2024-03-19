import { useNavigate } from 'react-router-dom';

import { LOGIN_PATH } from '../../../common/urls/client-urls';
import { getContestSubmissionPageUrl } from '../../../common/urls/compose-client-urls';
import { useLazyGetContestRegisteredUserQuery } from '../../../redux/services/contestsService';
import { useAppSelector } from '../../../redux/store';
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

    const navigate = useNavigate();
    const { isLoggedIn } = useAppSelector((state) => state.authorization);

    const [ registerUserQuery ] = useLazyGetContestRegisteredUserQuery();

    const onButtonClick = async () => {
        if (!isLoggedIn) {
            navigate(`/${LOGIN_PATH}`);
            return;
        }

        const queryData = await registerUserQuery({ id, isOfficial: isCompete });
        const { isOnlineExam, requirePassword } = queryData as any;

        if (requirePassword) {
            // create separate page for inputting the exam password
            navigate('/exam-password');
        } else if (isOnlineExam) {
            // should somehow open modal
        } else {
            navigate(getContestSubmissionPageUrl(isCompete, id));
        }
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
