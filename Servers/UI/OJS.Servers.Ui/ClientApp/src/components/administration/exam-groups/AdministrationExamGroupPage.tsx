import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Slide } from '@mui/material';

import ExamGroupEdit from './exam-group-edit/ExamGroupEdit';
import UsersInExamGroupView from './users-in-exam-group-view/UsersInExamGroupView';

import styles from './AdministrationExamGroupPage.module.scss';

const AdministrationExamGroupPage = () => {
    const { pathname } = useLocation();
    const [ , , , examGroupId ] = pathname.split('/');

    return (
        <Slide direction="left" in mountOnEnter unmountOnExit timeout={300}>
            <div>
                <Box>
                    <ExamGroupEdit examGroupId={Number(examGroupId)} />
                    <Box className={styles.paged}>
                        <UsersInExamGroupView examGroupId={Number(examGroupId)} />
                    </Box>
                </Box>
            </div>
        </Slide>
    );
};
export default AdministrationExamGroupPage;