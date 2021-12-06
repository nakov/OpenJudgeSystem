import * as React from 'react';
import { LinkButton } from '../guidelines/buttons/Button';

import softuniWizard from './softuni-wizard.png';
import styles from './AnonymousUser.module.scss';

const AnonymousUser = () => (
    <div className={styles.userTestBody}>
        <div className={styles.buttonsContainer}>
            <LinkButton text="Login" to="/login" size="large" />
            <LinkButton text="Register" to="/register" size="large" />
        </div>
        <div>
            <img src={softuniWizard} alt="softuni wizard" />
        </div>
    </div>
);

export default AnonymousUser;
