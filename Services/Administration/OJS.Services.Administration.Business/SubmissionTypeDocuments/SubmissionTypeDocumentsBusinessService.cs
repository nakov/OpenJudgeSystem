namespace OJS.Services.Administration.Business.SubmissionTypeDocuments;

using Ganss.Xss;
using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Business.SubmissionTypes;
using OJS.Services.Administration.Business.SubmissionTypesInSubmissionDocuments;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.SubmissionTypeDocuments;
using OJS.Services.Administration.Models.SubmissionTypesInSubmissionDocuments;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Infrastructure.Extensions;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class SubmissionTypeDocumentsBusinessService : AdministrationOperationService<SubmissionTypeDocument, int, SubmissionTypeDocumentAdministrationModel>, ISubmissionTypeDocumentsBusinessService
{
    private readonly HtmlSanitizer sanitizer;
    private readonly ISubmissionTypeDocumentsDataService submissionTypeDocumentsDataService;
    private readonly ISubmissionTypesBusinessService submissionTypesBusinessService;
    private readonly ISubmissionTypesInSubmissionDocumentsBusinessService submissionTypesInSubmissionDocumentsBusinessService;

    public SubmissionTypeDocumentsBusinessService(
        ISubmissionTypeDocumentsDataService submissionTypeDocumentsDataService,
        ISubmissionTypesBusinessService submissionTypesBusinessService,
        ISubmissionTypesInSubmissionDocumentsBusinessService submissionTypesInSubmissionDocumentsBusinessService)
    {
        this.submissionTypeDocumentsDataService = submissionTypeDocumentsDataService;
        this.submissionTypesBusinessService = submissionTypesBusinessService;
        this.submissionTypesInSubmissionDocumentsBusinessService = submissionTypesInSubmissionDocumentsBusinessService;

        this.sanitizer = new HtmlSanitizer();
        this.sanitizer.AllowedAttributes.Add("class");
        this.sanitizer.AllowedAttributes.Add("data-list");
    }

    public async Task<bool> ExistsById(int submissionTypeDocumentId)
        => await this.submissionTypeDocumentsDataService
            .ExistsById(submissionTypeDocumentId);

    public override async Task<SubmissionTypeDocumentAdministrationModel> Get(int id)
        => await this.submissionTypeDocumentsDataService
            .GetByIdQuery(id)
            .MapCollection<SubmissionTypeDocumentAdministrationModel>()
            .FirstAsync();

    public override async Task<SubmissionTypeDocumentAdministrationModel> Create(SubmissionTypeDocumentAdministrationModel model)
    {
        await this.ValidateSubmissionTypes(model.SubmissionTypesInSubmissionDocuments);

        model.Content = this.SanitizeString(model.Content);

        var submissionTypeDocument = model.Map<SubmissionTypeDocument>();
        await this.submissionTypeDocumentsDataService.Add(submissionTypeDocument);
        await this.submissionTypeDocumentsDataService.SaveChanges();

        return model;
    }

    public override async Task<SubmissionTypeDocumentAdministrationModel> Edit(SubmissionTypeDocumentAdministrationModel model)
    {
        var submissionTypeDocument = await this.submissionTypeDocumentsDataService
            .GetByIdQuery(model.Id)
            .FirstOrDefaultAsync();

        if (submissionTypeDocument is null)
        {
            throw new BusinessServiceException("Submission type document not found.");
        }

        // Validate that all submission types in the model are valid and exist in the database.
        await this.ValidateSubmissionTypes(model.SubmissionTypesInSubmissionDocuments);

        // Retrieve all existing SubmissionTypesInSubmissionDocuments associated with the current SubmissionTypeDocument.
        var currentSubmissionTypesInSubmissionDocument = await this.submissionTypesInSubmissionDocumentsBusinessService
            .GetAllBySubmissionTypeDocumentId(model.Id);

        // Convert to lists to avoid multiple enumerations
        var currentSubmissionTypesInSubmissionDocumentList = currentSubmissionTypesInSubmissionDocument.ToList();
        var modelSubmissionTypeIds = model.SubmissionTypesInSubmissionDocuments
                                          .Select(st => st.SubmissionTypeId)
                                          .ToList();

        // Remove the entities that are not present in the updated collection.
        foreach (var entity in currentSubmissionTypesInSubmissionDocumentList
                    .Where(stsd => !modelSubmissionTypeIds.Contains(stsd.SubmissionTypeId)))
        {
            this.submissionTypesInSubmissionDocumentsBusinessService.Delete(entity);
        }

        // Sanitize the content of the submission type document.
        model.Content = this.SanitizeString(model.Content);

        // Map the updated model values to the existing submission type document entity.
        submissionTypeDocument.MapFrom(model);

        // Update the submission type document in the database.
        this.submissionTypeDocumentsDataService.Update(submissionTypeDocument);

        // Persist all changes to the database.
        await this.submissionTypeDocumentsDataService.SaveChanges();

        return model;
    }

    public override async Task Delete(int id)
    {
        await this.submissionTypeDocumentsDataService.DeleteById(id);
        await this.submissionTypeDocumentsDataService.SaveChanges();
    }

    private async Task ValidateSubmissionTypes(IEnumerable<SubmissionTypeInSubmissionDocumentAdministrationModel> submissionTypes)
    {
        if (!await this.submissionTypesBusinessService.AllExist(submissionTypes))
        {
            throw new BusinessServiceException("An invalid submission type has been selected. Make sure all selected submission types are valid.");
        }
    }

    private string SanitizeString(string desanitizedString)
        => this.sanitizer.Sanitize(System.Net.WebUtility.HtmlDecode(desanitizedString));
}