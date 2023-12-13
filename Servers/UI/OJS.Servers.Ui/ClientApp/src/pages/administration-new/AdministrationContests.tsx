import React from 'react';

import { useGetAllAdminContestsQuery } from '../../redux/services/admin/contestsAdminService';

export const AdministrationContestsPage = () => {
    const {
        data,
        error,
        isLoading,
    } = useGetAllAdminContestsQuery({ page: 1, ItemsPerPage: 15 });

    console.log('data 123 => ', data);
    return (<div>admin contests</div>);
};
