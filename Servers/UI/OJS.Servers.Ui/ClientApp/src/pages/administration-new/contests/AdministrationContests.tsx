import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Typography } from '@mui/material';

import { DOWNLOAD } from '../../../common/labels';
import { CONTEST_IS_DELETED, CONTEST_IS_NOT_VISIBLE } from '../../../common/messages';
import { IGetAllAdminParams } from '../../../common/types';
import CreateButton from '../../../components/administration/common/create/CreateButton';
import AdministrationModal from '../../../components/administration/common/modals/administration-modal/AdministrationModal';
import ContestCompetePracticeButtons from '../../../components/administration/contests/contest-compete-practce-buttons/ContestCompetePracticeButtons';
import ContestDownloadSubmissions from '../../../components/administration/contests/contest-download-submissions/ContestDownloadSubmissions';
import ContestEdit from '../../../components/administration/contests/contest-edit/ContestEdit';
import FormActionButton from '../../../components/administration/form-action-button/FormActionButton';
import SpinningLoader from '../../../components/guidelines/spinning-loader/SpinningLoader';
import { setAdminContestsFilters, setAdminContestsSorters } from '../../../redux/features/admin/contestsAdminSlice';
import { useDeleteContestMutation, useDownloadResultsMutation, useGetAllAdminContestsQuery } from '../../../redux/services/admin/contestsAdminService';
import { useAppSelector } from '../../../redux/store';
import { DEFAULT_ITEMS_PER_PAGE } from '../../../utils/constants';
import downloadFile from '../../../utils/file-download-utils';
import { getAndSetExceptionMessage } from '../../../utils/messages-utils';
import { flexCenterObjectStyles } from '../../../utils/object-utils';
import { renderErrorMessagesAlert } from '../../../utils/render-utils';
import { IAdministrationFilter } from '../administration-filters/AdministrationFilters';
import AdministrationGridView from '../AdministrationGridView';

import contestFilterableColumns, { returnContestsNonFilterableColumns } from './contestsGridColumns';

// eslint-disable-next-line css-modules/no-unused-class
import formStyles from '../../../components/administration/common/styles/FormStyles.module.scss';

const AdministrationContestsPage = () => {
    const [ searchParams ] = useSearchParams();
    const [ openEditContestModal, setOpenEditContestModal ] = useState(false);
    const [ openShowCreateContestModal, setOpenShowCreateContestModal ] = useState<boolean>(false);
    const [ contestId, setContestId ] = useState<number>();
    const [ showDownloadSubsModal, setShowDownloadSubsModal ] = useState<boolean>(false);
    const [ showExportExcelModal, setShowExportExcelModal ] = useState<boolean>(false);

    const [ selectedFilters, setSelectedFilters ] = useState<Array<IAdministrationFilter> | null>([]);
    const [ excelExportType, setExcelExportType ] = useState<number>(0);

    const [ queryParams, setQueryParams ] = useState<IGetAllAdminParams>({
        page: 1,
        itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
        filter: searchParams.get('filter') ?? '',
        sorting: searchParams.get('sorting') ?? '',
    });
    const [ errorMessages, setErrorMessages ] = useState<Array<string>>([]);
    // const selectedFilters = useAppSelector((state) => state.adminContests['all-contests']?.selectedFilters);
    const selectedSorters = useAppSelector((state) => state.adminContests['all-contests']?.selectedSorters);

    console.log(selectedSorters);
    const {
        refetch: retakeContests,
        data,
        error,
        isLoading,
    } = useGetAllAdminContestsQuery(queryParams);

    const [
        exportResutls,
        {
            data: file,
            isSuccess: isSuccessfullyDownloaded,
            error: downloadError,
            reset: resetExport,
        },
    ] = useDownloadResultsMutation();

    const onEditClick = (id: number) => {
        setOpenEditContestModal(true);
        setContestId(id);
    };

    const filterParams = searchParams.get('filter');
    const sortingParams = searchParams.get('sorting');

    useEffect(() => {
        setQueryParams((currentParams) => ({ ...currentParams, filter: filterParams ?? '' }));
    }, [ filterParams ]);

    useEffect(() => {
        setQueryParams((currentParams) => ({ ...currentParams, sorting: sortingParams ?? '' }));
    }, [ sortingParams ]);

    useEffect(() => {
        if (isSuccessfullyDownloaded) {
            if (file) {
                downloadFile(file.blob, file.filename);
            } else {
                setErrorMessages([ 'The required file is empty.' ]);
            }
            resetExport();
        }
    }, [ file, isSuccessfullyDownloaded, resetExport ]);

    useEffect(() => {
        getAndSetExceptionMessage([ downloadError ], setErrorMessages);
    }, [ downloadError ]);

    const onClose = (isEditMode: boolean) => {
        if (isEditMode) {
            setOpenEditContestModal(false);
        } else {
            setOpenShowCreateContestModal(false);
        }
        retakeContests();
    };
    const onClickExcel = (exelExportContestId: number) => {
        setShowExportExcelModal(true);
        setContestId(exelExportContestId);
    };

    const onDownloadSubmissionClick = (contestToDownloadSubs: number) => {
        setShowDownloadSubsModal(true);
        setContestId(contestToDownloadSubs);
    };

    const renderDownloadSubsModal = (index: number) => (
        <AdministrationModal
          key={index}
          index={index}
          open={showDownloadSubsModal}
          onClose={() => setShowDownloadSubsModal(false)}
        >
            <ContestDownloadSubmissions contestid={contestId!} />
        </AdministrationModal>
    );

    const renderExcelExportModal = (index: number) => (
        <AdministrationModal
          key={index}
          index={index}
          open={showExportExcelModal}
          onClose={() => setShowExportExcelModal(false)}
        >
            <>
                <Typography className={formStyles.centralize} variant="h4">Export contest results</Typography>
                <form className={formStyles.form}>
                    <ContestCompetePracticeButtons value={excelExportType} setStateFunc={setExcelExportType} />
                    <FormActionButton
                      className={formStyles.buttonsWrapper}
                      buttonClassName={formStyles.button}
                      onClick={() => exportResutls({ id: contestId!, type: excelExportType })}
                      name={DOWNLOAD}
                    />
                </form>
            </>
        </AdministrationModal>
    );

    const renderContestModal = (index: number, isEditMode: boolean) => (
        <AdministrationModal
          key={index}
          index={index}
          open={isEditMode
              ? openEditContestModal
              : openShowCreateContestModal}
          onClose={() => onClose(isEditMode)}
        >
            <ContestEdit
              contestId={isEditMode
                  ? Number(contestId)
                  : null}
              isEditMode={isEditMode}
              onSuccess={() => onClose(isEditMode)}
              onDeleteSuccess={() => onClose(isEditMode)}
            />
        </AdministrationModal>
    );

    const renderGridActions = () => (
        <CreateButton
          showModal={openShowCreateContestModal}
          showModalFunc={setOpenShowCreateContestModal}
          styles={{ width: '40px', height: '40px', color: 'rgb(25,118,210)' }}
        />
    );

    if (isLoading) {
        return <div style={{ ...flexCenterObjectStyles }}><SpinningLoader /></div>;
    }

    return (
        <>
            {renderErrorMessagesAlert(errorMessages)}
            <AdministrationGridView
              data={data}
              error={error}
              filterableGridColumnDef={contestFilterableColumns}
              notFilterableGridColumnDef={returnContestsNonFilterableColumns(
                  onEditClick,
                  useDeleteContestMutation,
                  retakeContests,
                  onClickExcel,
                  onDownloadSubmissionClick,
              )}
              renderActionButtons={renderGridActions}
              queryParams={queryParams}
              setQueryParams={setQueryParams}
              selectedFilters={selectedFilters || []}
              selectedSorters={selectedSorters || []}
              setSorterStateAction={setAdminContestsSorters}
              setFilterStateAction={setSelectedFilters}
              location="all-contests"
              modals={[
                  { showModal: openShowCreateContestModal, modal: (i) => renderContestModal(i, false) },
                  { showModal: openEditContestModal, modal: (i) => renderContestModal(i, true) },
                  { showModal: showDownloadSubsModal, modal: (i) => renderDownloadSubsModal(i) },
                  { showModal: showExportExcelModal, modal: (i) => renderExcelExportModal(i) },
              ]}
              legendProps={[ { color: '#FFA1A1', message: CONTEST_IS_DELETED }, { color: '#C0C0C0', message: CONTEST_IS_NOT_VISIBLE } ]}
            />
        </>
    );
};

export default AdministrationContestsPage;
