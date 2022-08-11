import * as React from 'react';
import { useParams } from 'react-router';
import { useCallback } from 'react';
import { useCurrentContest } from '../../../hooks/use-current-contest';
import Heading, { HeadingType } from '../../guidelines/headings/Heading';
import FormControl, { FormControlType } from '../../guidelines/forms/FormControl';
import Form from '../../guidelines/forms/Form';
import styles from './ContestPasswordForm.module.scss';

interface IContestPasswordFormProps {
    id: number;
    isOfficial: boolean;
}

const ContestPasswordForm = ({ id, isOfficial }: IContestPasswordFormProps) => {
    const {
        state: { contest },
        actions: {
            setContestPassword,
            submitPassword,
        },
    } = useCurrentContest();

    const passwordFieldName = 'contestPassword';

    const handleOnSubmitPassword = useCallback(async () => {
        await submitPassword({ id, isOfficial });
    }, [ id, isOfficial, submitPassword ]);

    const handleOnChangeUpdatePassword = useCallback((value: any) => {
        setContestPassword(value);
    }, [ setContestPassword ]);

    return (
        <Form
          className={styles.contestPasswordForm}
          onSubmit={() => {
              handleOnSubmitPassword();
          }}
        >
            <header className={styles.formHeader}>
                <Heading type={HeadingType.primary}>Enter contest password</Heading>
                <Heading type={HeadingType.secondary} className={styles.contestNameHeading}>{contest?.name}</Heading>
            </header>
            <FormControl
              id={passwordFieldName.toLowerCase()}
              name={passwordFieldName}
              labelText="Password"
              type={FormControlType.password}
              onChange={(value) => handleOnChangeUpdatePassword(value)}
              value=""
            />
        </Form>
    );
};

export default ContestPasswordForm;
