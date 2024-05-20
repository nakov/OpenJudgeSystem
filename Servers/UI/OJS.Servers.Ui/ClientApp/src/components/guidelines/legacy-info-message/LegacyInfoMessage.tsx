import AlertBox, {AlertBoxType} from "../../guidelines/alert-box/AlertBox";

import styles from './LegacyInfoMessage.module.scss';
import React, {ReactNode} from "react";
import {ButtonSize, LinkButton, LinkButtonType} from "../buttons/Button";

const LegacyInfoMessage = () => {
    const getLegacySubmissionsInfoMessage = () => {
        return (
            <p>Your contest history, submissions, and scores were not transferred to the current platform. To view this information, access your
                <LinkButton
                    type={LinkButtonType.plain}
                    size={ButtonSize.none}
                    to={'https://judge.softuni.org/Users/Profile'}
                    text={' profile'}
                    internalClassName={styles.profileButton}
                /> on the legacy system.
            </p>
        )
    }
    
    return (
        <AlertBox
            type={AlertBoxType.info}
            isClosable={false}
            className={styles.legacyInfoMessage}
            message={getLegacySubmissionsInfoMessage()}
        />
    )
}

export default LegacyInfoMessage;