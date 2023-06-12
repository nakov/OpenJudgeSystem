import React, { useEffect, useState } from 'react';
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
        state: { currentSubmission },
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

    const [ selectedSubmissionId, setSelectedSubmissionId ] = useState(currentSubmission?.id);

    useEffect(
        () => {
            if (selectedSubmissionId === submissionId) {
                return;
            }

            setSelectedSubmissionId(Number(submissionId));
        },
        [ selectedSubmissionId, submissionId ],
    );

    useEffect(
        () => {
            if (isNil(selectedSubmissionId)) {
                return;
            }

            selectSubmissionById(selectedSubmissionId);
        },
        [ getDetails, selectedSubmissionId, selectSubmissionById ],
    );

    return (
        <SubmissionDetails />
    );
};

export default setLayout(SubmissionDetailsPage, true);
