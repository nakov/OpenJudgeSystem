import React, { useEffect } from 'react';
import isNil from 'lodash/isNil';

import SubmissionDetails from '../../components/submissions/details/SubmissionDetails';
import { useRouteUrlParams } from '../../hooks/common/use-route-url-params';
import { useSubmissionsDetails } from '../../hooks/submissions/use-submissions-details';
import { makePrivate } from '../shared/make-private';
import { setLayout } from '../shared/set-layout';

const SubmissionDetailsPage = () => {
    const { state: { params } } = useRouteUrlParams();
    const { submissionId } = params;
    const { actions: { selectSubmissionById } } = useSubmissionsDetails();

    useEffect(
        () => {
            if (isNil(submissionId)) {
                return;
            }

            selectSubmissionById(submissionId);
        },
        [ selectSubmissionById, submissionId ],
    );

    return (
        <SubmissionDetails />
    );
};

export default makePrivate(setLayout(SubmissionDetailsPage, true));
