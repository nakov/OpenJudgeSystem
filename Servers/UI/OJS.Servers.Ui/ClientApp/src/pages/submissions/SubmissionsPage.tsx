import React, { useEffect } from 'react';

import SubmissionsGrid from '../../components/submissions/submissions-grid/SubmissionsGrid';
import { usePublicSubmissions } from '../../hooks/submissions/use-public-submissions';
import { setLayout } from '../shared/set-layout';

const SubmissionsPage = () => {
    const {
        state: { totalSubmissionsCount },
        actions: { loadTotalSubmissionsCount },
    } = usePublicSubmissions();

    useEffect(
        () => {
            if (totalSubmissionsCount !== 0) {
                return;
            }

            (async () => {
                await loadTotalSubmissionsCount();
            })();
        },
        [ loadTotalSubmissionsCount, totalSubmissionsCount ],
    );

    return (
        <SubmissionsGrid />
    );
};

export default setLayout(SubmissionsPage);
