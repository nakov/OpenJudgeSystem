import React, { useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';

import SubmissionsGrid from '../../components/submissions/submissions-grid/SubmissionsGrid';
import { useHashUrlParams } from '../../hooks/common/use-hash-url-params';
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
    const { state: { params }, actions: { clearHash } } = useHashUrlParams();

    useEffect(() => {
        if (!isEmpty(params)) {
            clearHash();
        }
    }, [ clearHash, params ]);

    useEffect(
        () => {
            if (!isEmpty(submissions) || totalSubmissionsCount !== 0) {
                return;
            }

            (async () => {
                await load();
                clearHash();
            })();
        },
        [ clearHash, load, submissions, totalSubmissionsCount ],
    );

    return (
        <SubmissionsGrid />
    );
};

export default setLayout(SubmissionsPage);
