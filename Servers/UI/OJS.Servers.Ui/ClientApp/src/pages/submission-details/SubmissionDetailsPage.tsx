import SubmissionDetails from '../../components/submissions/details/SubmissionDetails';
import { makePrivate } from '../shared/make-private';
import { setLayout } from '../shared/set-layout';

// eslint-disable-next-line react/react-in-jsx-scope
const SubmissionDetailsPage = () => <SubmissionDetails />;

export default makePrivate(setLayout(SubmissionDetailsPage, true));
