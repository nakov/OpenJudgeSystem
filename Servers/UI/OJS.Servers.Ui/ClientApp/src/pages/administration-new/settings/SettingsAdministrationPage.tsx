import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { IGetAllAdminParams } from '../../../common/types';
import CreateButton from '../../../components/administration/common/create/CreateButton';
import AdministrationModal from '../../../components/administration/common/modals/administration-modal/AdministrationModal';
import SettingForm from '../../../components/administration/settings/form/SettingForm';
import { useDeleteSettingMutation, useGetAllSettingsQuery, useLazyExportSettingsToExcelQuery } from '../../../redux/services/admin/settingsAdminService';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import { applyDefaultFilterToQueryString, IAdministrationFilter, mapGridColumnsToAdministrationFilterProps, mapUrlToFilters } from '../administration-filters/AdministrationFilters';
import { IAdministrationSorter, mapGridColumnsToAdministrationSortingProps, mapUrlToSorters } from '../administration-sorting/AdministrationSorting';
import AdministrationGridView from '../AdministrationGridView';

import settingsFilterableColumns, { returnSettingsNonFilterableColumns } from './settingsGridColumns';

const AdministrationSettingsPage = () => {
    const [ searchParams ] = useSearchParams();

    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: applyDefaultFilterToQueryString(searchParams, settingsFilterableColumns),
        sorting: searchParams.get('sorting') ?? '',
    });

    const [ showEditModal, setShowEditModal ] = useState<boolean>(false);
    const [ settingId, setSettingId ] = useState<number | undefined>(undefined);

    const [ showCreateModal, setShowCreateModal ] = useState<boolean>(false);

    const { refetch, data: settingsData, error } = useGetAllSettingsQuery(queryParams);

    const [ selectedFilters, setSelectedFilters ] = useState<Array<IAdministrationFilter>>(mapUrlToFilters(
        searchParams ?? '',
        mapGridColumnsToAdministrationFilterProps(settingsFilterableColumns),
    ));

    const [ selectedSorters, setSelectedSorters ] = useState<Array<IAdministrationSorter>>(mapUrlToSorters(
        searchParams ?? '',
        mapGridColumnsToAdministrationSortingProps(settingsFilterableColumns),
    ));

    useEffect(() => {
        setQueryParams((currentParams) => ({
            ...currentParams,
            filter: applyDefaultFilterToQueryString(searchParams, settingsFilterableColumns),
            sorting: searchParams.get('sorting') ?? '',
        }));
    }, [ searchParams ]);

    const onEditClick = (id: number) => {
        setShowEditModal(true);
        setSettingId(id);
    };

    const onModalClose = (isEditMode: boolean) => {
        if (isEditMode) {
            setShowEditModal(false);
        } else {
            setShowCreateModal(false);
        }
        refetch();
    };

    const renderSettingModal = (index: number, isEditMode: boolean) => (
        <AdministrationModal
          key={index}
          index={index}
          onClose={() => onModalClose(isEditMode)}
          open={isEditMode
              ? showEditModal
              : showCreateModal}
        >
            <SettingForm
              isEditMode={isEditMode}
              id={isEditMode
                  ? settingId
                  : undefined}
            />
        </AdministrationModal>
    );

    const renderGridActions = () => (
        <CreateButton
          showModal={showCreateModal}
          showModalFunc={setShowCreateModal}
          styles={{ width: '40px', height: '40px', color: 'rgb(25,118,210)' }}
        />
    );

    return (
        <AdministrationGridView
          filterableGridColumnDef={settingsFilterableColumns}
          notFilterableGridColumnDef={returnSettingsNonFilterableColumns(
              onEditClick,
              useDeleteSettingMutation,
              () => refetch(),
          )}
          data={settingsData}
          error={error}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          selectedFilters={selectedFilters}
          selectedSorters={selectedSorters}
          setSorterStateAction={setSelectedSorters}
          setFilterStateAction={setSelectedFilters}
          excelMutation={useLazyExportSettingsToExcelQuery}
          renderActionButtons={renderGridActions}
          modals={[
              { showModal: showEditModal, modal: (i) => renderSettingModal(i, true) },
              { showModal: showCreateModal, modal: (i) => renderSettingModal(i, false) },
          ]}
        />
    );
};

export default AdministrationSettingsPage;
