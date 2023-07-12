import React, { useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';

import SubmissionsGrid from '../../components/submissions/submissions-grid/SubmissionsGrid';
import { usePublicSubmissions } from '../../hooks/submissions/use-public-submissions';
import { setLayout } from '../shared/set-layout';

const SubmissionsPage = () => {
    const {
        state: {
            submissions,
            totalSubmissionsCount,
        },
        actions: { load },
    } = usePublicSubmissions();

    useEffect(
        () => {
            if (!isEmpty(submissions) || totalSubmissionsCount !== 0) {
                return;
            }

            (async () => {
                await load();
            })();
        },
        [ load, submissions, totalSubmissionsCount ],
    );

    return (
        <SubmissionsGrid />
    );
};

export default setLayout(SubmissionsPage);
