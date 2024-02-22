import { useLocation } from 'react-router-dom';

import ProblemGroupForm from './problem-group-form/ProblemGroupForm';

const AdministrationProblemGroup = () => {
    const { pathname } = useLocation();
    const [ , , , problemGroupId ] = pathname.split('/');
    return (
        <ProblemGroupForm id={Number(problemGroupId)} />
    );
};
export default AdministrationProblemGroup;
