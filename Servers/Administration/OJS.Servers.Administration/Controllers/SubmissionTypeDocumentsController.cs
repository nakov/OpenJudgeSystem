namespace OJS.Servers.Administration.Controllers;

using Microsoft.AspNetCore.Mvc;
using OJS.Data.Models.Submissions;
using OJS.Servers.Administration.Attributes;
using OJS.Services.Administration.Business.SubmissionTypeDocuments;
using OJS.Services.Administration.Business.SubmissionTypeDocuments.GridData;
using OJS.Services.Administration.Business.SubmissionTypeDocuments.Permissions;
using OJS.Services.Administration.Business.SubmissionTypeDocuments.Validators;
using OJS.Services.Administration.Business.SubmissionTypes;
using OJS.Services.Administration.Business.SubmissionTypesInSubmissionDocuments;
using OJS.Services.Administration.Models.SubmissionTypeDocuments;
using System.Threading.Tasks;
using OJS.Data.Models;
using OJS.Services.Common.Data;

public class SubmissionTypeDocumentsController : BaseAdminApiController<SubmissionTypeDocument, int, SubmissionTypeDocumentInListModel, SubmissionTypeDocumentAdministrationModel>
{
    private readonly ISubmissionTypeDocumentsBusinessService submissionTypeDocumentsBusinessService;
    private readonly ISubmissionTypesBusinessService submissionTypesBusinessService;
    private readonly ISubmissionTypesInSubmissionDocumentsBusinessService submissionTypesInSubmissionDocumentsBusinessService;

    public SubmissionTypeDocumentsController(
        ISubmissionTypeDocumentsGridDataService submissionTypeDocumentsGridDataService,
        ISubmissionTypeDocumentsBusinessService submissionTypeDocumentsBusinessService,
        SubmissionTypeDocumentsAdministrationValidator submissionTypeDocumentsAdministrationValidator,
        ISubmissionTypesBusinessService submissionTypesBusinessService,
        ISubmissionTypesInSubmissionDocumentsBusinessService submissionTypesInSubmissionDocumentsBusinessService,
        IDataService<AccessLog> accessLogsData)
        : base(
            submissionTypeDocumentsGridDataService,
            submissionTypeDocumentsBusinessService,
            submissionTypeDocumentsAdministrationValidator,
            accessLogsData)
    {
        this.submissionTypeDocumentsBusinessService = submissionTypeDocumentsBusinessService;
        this.submissionTypesBusinessService = submissionTypesBusinessService;
        this.submissionTypesInSubmissionDocumentsBusinessService = submissionTypesInSubmissionDocumentsBusinessService;
    }

    [HttpDelete]
    [ProtectedEntityAction("model", typeof(SubmissionTypeDocumentDeleteModelPermissionsService))]
    public async Task<IActionResult> DeleteByIdAndSubmissionTypeId([FromBody] DeleteSubmissionTypeDocumentModel model)
    {
        if (!await this.submissionTypeDocumentsBusinessService.ExistsById(model.SubmissionTypeDocumentId))
        {
            return this.UnprocessableEntity("The submission type document does not exist.");
        }

        if (!await this.submissionTypesBusinessService.ExistsById(model.SubmissionTypeId))
        {
            return this.UnprocessableEntity("The submission type does not exist.");
        }

        await this.submissionTypesInSubmissionDocumentsBusinessService.DeleteByIdAndSubmissionTypeId(model.SubmissionTypeDocumentId, model.SubmissionTypeId);
        // If no more submission types are related to the document, delete the document as well.
        if (await this.submissionTypesInSubmissionDocumentsBusinessService.IsLastSubmissionType(model.SubmissionTypeDocumentId))
        {
            await this.submissionTypeDocumentsBusinessService.Delete(model.SubmissionTypeDocumentId);
        }

        return this.Ok($"Successfully deleted {nameof(SubmissionTypeDocument)} with id: {model.SubmissionTypeDocumentId} and submission type id: {model.SubmissionTypeId}");
    }
}