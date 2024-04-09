import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import TabsInView from '../common/tabs/TabsInView';

import RoleForm from './form/RoleForm';
import UsersInRoleView from './users-in-role-view/UsersInRoleView';

enum ROLE_LISTED_DATA {
    USERS = 'users',
}

const AdministrationRole = () => {
    const { pathname } = useLocation();
    const [ , , , roleId ] = pathname.split('/');
    const [ tabName, setTabName ] = useState(ROLE_LISTED_DATA.USERS);
    const [ roleName, setRoleName ] = useState<string>('');

    const onTabChange = (event: React.SyntheticEvent, newValue: ROLE_LISTED_DATA) => {
        setTabName(newValue);
    };

    const returnRoleForm = () => (
        <RoleForm id={roleId} isEditMode getRoleName={(role:string) => setRoleName(role)} />
    );

    const returnUsersInRoleView = (key:string) => (
        <UsersInRoleView
          key={key}
          roleId={roleId}
          roleName={roleName}
        />
    );

    return (
        <TabsInView
          form={returnRoleForm}
          onTabChange={onTabChange}
          tabName={tabName}
          tabs={[
              { value: ROLE_LISTED_DATA.USERS, label: 'Users', node: returnUsersInRoleView },
          ]}
        />
        
    );
};
export default AdministrationRole;
