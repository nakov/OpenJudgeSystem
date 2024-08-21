/* eslint-disable import/no-extraneous-dependencies */
import { useLocation, useNavigate } from 'react-router-dom';

import { ThemeMode } from '../../../common/enums';
import { ISubmissionTypeInSubmissionDocumentInViewModel } from '../../../common/types';
import { NEW_ADMINISTRATION_PATH, SUBMISSION_TYPE_DOCUMENTS_PATH } from '../../../common/urls/administration-urls';
import {
    useGetAllSubmissionTypesInSubmissionDocumentsByMultipleSubmissionTypeIdsQuery,
} from '../../../redux/services/admin/submissionTypesInSubmissionDocumentsAdminService';
import { useAppSelector } from '../../../redux/store';

import styles from './AdministrationSubmissionTypeDocumentViewPage.module.scss';

const AdministrationSubmissionTypeDocumentViewPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const currentThemeMode = useAppSelector((x) => x.theme.administrationMode);

    const queryParams = new URLSearchParams(location.search);

    const submissionTypeIdsParam = queryParams.get('submissionTypeIds') || '';
    const submissionTypeIds = submissionTypeIdsParam
        .split(',')
        .map(Number)
        .filter((id) => !Number.isNaN(id));

    const { data: submissionTypeDocumentsData } = useGetAllSubmissionTypesInSubmissionDocumentsByMultipleSubmissionTypeIdsQuery(
        submissionTypeIds,
        { skip: submissionTypeIds.length === 0 },
    );

    return (
        <div className={`${styles.container} ${currentThemeMode === ThemeMode.Dark
            ? styles.dark
            : styles.light}`}
        >
            {submissionTypeDocumentsData?.map((submissionType: ISubmissionTypeInSubmissionDocumentInViewModel, typeIndex: number) => (
                <div key={submissionType.submissionTypeDocumentId}>
                    <ol className={styles.submissionTypeList}>
                        {submissionType.submissionTypes.map((type, index) => (
                            <button
                              key={index}
                              className={styles.submissionTypeItem}
                              type="button"
                              /* eslint-disable-next-line max-len */
                              onClick={() => navigate(`/${NEW_ADMINISTRATION_PATH}/${SUBMISSION_TYPE_DOCUMENTS_PATH}/${submissionType.submissionTypeDocumentId}?isEditMode=true`)}
                            >
                                {type}
                            </button>
                        ))}
                    </ol>
                    <div className={styles.entityContainer}>
                        <h2 className={styles.title}>{submissionType.submissionTypeDocumentTitle}</h2>
                        <div
                          className={`ql-editor ${currentThemeMode === ThemeMode.Dark
                              ? 'quill-dark-theme'
                              : 'quill-light-theme'} ${styles.content}`}
                          dangerouslySetInnerHTML={{ __html: submissionType.submissionTypeDocumentContent }}
                        />
                    </div>
                    {typeIndex < submissionTypeDocumentsData.length - 1 && (
                        <hr className={styles.divider} />
                    )}
                </div>
            ))}
        </div>
    );
};

export default AdministrationSubmissionTypeDocumentViewPage;
