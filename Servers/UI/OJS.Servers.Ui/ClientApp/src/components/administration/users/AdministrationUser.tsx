import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { LECTURER } from '../../../common/constants';
import { useGetUserByIdQuery } from '../../../redux/services/admin/usersAdminService';
import SpinningLoader from '../../guidelines/spinning-loader/SpinningLoader';
import TabsInView from '../common/tabs/TabsInView';

import UserForm from './form/UserForm';
import LecturerInCategories from './lecturer/LecturerInCategories';
import LecturerInContests from './lecturer/LecturerInContests';

enum USER_LISTED_DATA {
    LECTURER_IN_CONTEST = 'lectureInContest',
    LECTURER_IN_CATEGORIES = 'participants'
}

const AdministrationUser = () => {
    const { pathname } = useLocation();
    const [ , , , userId ] = pathname.split('/');

    const [ tabName, setTabName ] = useState(USER_LISTED_DATA.LECTURER_IN_CONTEST);

    const {
        data: userData,
        isLoading: isGetting,
    } = useGetUserByIdQuery(userId);

    const onTabChange = (event: React.SyntheticEvent, newValue: USER_LISTED_DATA) => {
        setTabName(newValue);
    };

    const renderForm = () => (
        <UserForm id={userId} providedUser={userData} />
    );

    const renderProblemsInContestView = (key:string) => (
        userData?.roles.find((x) => x.name === LECTURER)
            ? <LecturerInContests key={key} userId={userData!.id} />
            : (
                <>
                </>
            )
    );

    const renderParticipantsInContestView = (key: string) => (
        userData?.roles.find((x) => x.name === LECTURER)
            ? <LecturerInCategories key={key} />
            : (
                <>
                </>
            )
    );

    if (isGetting) {
        return <SpinningLoader />;
    }

    return (
        <TabsInView
          form={renderForm}
          onTabChange={onTabChange}
          tabName={tabName}
          tabs={[
              {
                  value: USER_LISTED_DATA.LECTURER_IN_CONTEST,
                  label: 'Lecturer in Contests',
                  node: renderProblemsInContestView,
                  disabled: !userData?.roles.find((x) => x.name === LECTURER),
              },
              {
                  value: USER_LISTED_DATA.LECTURER_IN_CATEGORIES,
                  label: 'Lecturer in Categories',
                  node: renderParticipantsInContestView,
                  disabled: !userData?.roles.find((x) => x.name === LECTURER),
              },
          ]}
        />
    );
};

export default AdministrationUser;
