import React, { useEffect } from 'react';

import SubmissionsGrid from '../../components/submissions/submissions-grid/SubmissionsGrid';
import { usePublicSubmissions } from '../../hooks/submissions/use-public-submissions';
import { useAuth } from '../../hooks/use-auth';
import { setLayout } from '../shared/set-layout';

const SubmissionsPage = () => {
    const {
        state: { totalSubmissionsCount },
        actions: {
            loadTotalSubmissionsCount,
            loadTotalUnprocessedSubmissionsCount,
        },
    } = usePublicSubmissions();
    const { state: { user } } = useAuth();

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

    useEffect(
        () => {
            if (!user.isInRole) {
                return;
            }

            (async () => {
                await loadTotalUnprocessedSubmissionsCount();
            })();
        },
        [ loadTotalUnprocessedSubmissionsCount, user.isInRole ],
    );

    return (
        <SubmissionsGrid />
    );
};

export default setLayout(SubmissionsPage);
