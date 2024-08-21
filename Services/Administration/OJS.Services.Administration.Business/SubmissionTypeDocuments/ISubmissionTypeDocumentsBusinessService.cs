namespace OJS.Services.Administration.Business.SubmissionTypeDocuments;

using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Models.SubmissionTypeDocuments;
using OJS.Services.Infrastructure.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface ISubmissionTypeDocumentsBusinessService : IAdministrationOperationService<SubmissionTypeDocument, int,
    SubmissionTypeDocumentAdministrationModel>
{
    Task<bool> ExistsById(int submissionTypeDocumentId);
}