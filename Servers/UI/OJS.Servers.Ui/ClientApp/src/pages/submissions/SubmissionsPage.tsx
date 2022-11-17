import React, { useEffect } from 'react';

import { PageTitles } from '../../common/page-titles';
import { ChangePageTitle } from '../../components/common/ChangePageTitle';
import SubmissionsGrid from '../../components/submissions/submissions-grid/SubmissionsGrid';
import { usePublicSubmissions } from '../../hooks/submissions/use-public-submissions';
import { setLayout } from '../shared/set-layout';

const SubmissionsPage = () => {
    const { actions: { load } } = usePublicSubmissions();

    ChangePageTitle(PageTitles.submissions);

    useEffect(
        () => {
            (async () => {
                await load();
            })();
        },
        [ load ],
    );

    return (
        <SubmissionsGrid />
    );
};

export default setLayout(SubmissionsPage);
