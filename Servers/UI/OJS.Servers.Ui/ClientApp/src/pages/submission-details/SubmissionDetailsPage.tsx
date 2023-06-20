import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import isNil from 'lodash/isNil';

import SubmissionDetails from '../../components/submissions/details/SubmissionDetails';
import { useRouteUrlParams } from '../../hooks/common/use-route-url-params';
import { useSubmissionsDetails } from '../../hooks/submissions/use-submissions-details';
import { useAppUrls } from '../../hooks/use-app-urls';
import { useAuth } from '../../hooks/use-auth';
import { setLayout } from '../shared/set-layout';

const SubmissionDetailsPage = () => {
    const { state: { params } } = useRouteUrlParams();
    const { submissionId } = params;
    const {
        actions: {
            getDetails,
            selectSubmissionById,
        },
    } = useSubmissionsDetails();
    const { state: { isLoggedIn } } = useAuth();
    const navigate = useNavigate();
    const { getLoginUrl } = useAppUrls();

    useEffect(
        () => {
            if (!isLoggedIn) {
                navigate(getLoginUrl());
            }
        },
        [ isLoggedIn, navigate, getLoginUrl ],
    );

    useEffect(
        () => {
            if (isNil(submissionId)) {
                return;
            }

            selectSubmissionById(submissionId);
        },
        [ getDetails, selectSubmissionById, submissionId ],
    );

    return (
        <SubmissionDetails />
    );
};

export default setLayout(SubmissionDetailsPage, true);
