import React from 'react';

import { LinkButton } from '../../components/guidelines/buttons/Button';
import Heading, { HeadingType } from '../../components/guidelines/headings/Heading';
import { makePrivate } from '../shared/make-private';
import { setLayout } from '../shared/set-layout';

import image from './page-not-found.png';

import styles from './NotFoundPage.module.scss';

const NotFoundPage = () => (
    <div className={styles.container}>
        <img
          className={styles.image}
          src={image}
          alt="Not Found"
        />
        <p className={styles.httpCodeParagraph}>404</p>
        <Heading type={HeadingType.secondary}>Page Not Found</Heading>
        <LinkButton
          to="/"
          text="Back to Home"
          className={styles.backBtn}
        />
    </div>
);

export default makePrivate(setLayout(NotFoundPage));
