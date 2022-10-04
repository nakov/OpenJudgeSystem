import React, { useEffect } from 'react';

import { setLayout } from '../shared/set-layout';

import SubmissionsGrid from '../../components/submissions/submissions-grid/SubmissionsGrid';

import { usePublicSubmissions } from '../../hooks/submissions/use-public-submissions';

const SubmissionsPage = () => {
    const { actions: { load } } = usePublicSubmissions();

    useEffect(
        () => {
            (async () => {
                await load();
            })();
        },
        [ load ],
    );

    return (
        <SubmissionsGrid/>
    );
};

export default setLayout(SubmissionsPage);
