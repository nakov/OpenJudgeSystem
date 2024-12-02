namespace OJS.Services.Administration.Business.SubmissionTypesInSubmissionDocuments;

using Microsoft.EntityFrameworkCore;
using OJS.Data.Models;
using OJS.Services.Administration.Models.SubmissionTypesInSubmissionDocuments;
using OJS.Services.Common.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class SubmissionTypesInSubmissionDocumentsBusinessService : ISubmissionTypesInSubmissionDocumentsBusinessService
{
    private readonly IDataService<SubmissionTypeInSubmissionDocument> submissionTypesInSubmissionDocumentsDataService;

    public SubmissionTypesInSubmissionDocumentsBusinessService(
        IDataService<SubmissionTypeInSubmissionDocument> submissionTypesInSubmissionDocumentsDataService)
        => this.submissionTypesInSubmissionDocumentsDataService = submissionTypesInSubmissionDocumentsDataService;

    public async Task DeleteByIdAndSubmissionTypeId(int submissionTypeDocumentId, int submissionTypeId)
    {
        this.submissionTypesInSubmissionDocumentsDataService
            .Delete((await this.submissionTypesInSubmissionDocumentsDataService
                .One(stsd =>
                    stsd.SubmissionTypeDocumentId == submissionTypeDocumentId &&
                    stsd.SubmissionTypeId == submissionTypeId))!);

        await this.submissionTypesInSubmissionDocumentsDataService.SaveChanges();
    }

    public async Task<bool> IsLastSubmissionType(int submissionTypeDocumentId)
        => !await this.submissionTypesInSubmissionDocumentsDataService
            .Exists(stsd => stsd.SubmissionTypeDocumentId == submissionTypeDocumentId);

    public async Task<IEnumerable<SubmissionTypeInSubmissionDocument>> GetAllBySubmissionTypeDocumentId(
        int submissionDocumentId)
        => await this.submissionTypesInSubmissionDocumentsDataService
            .GetQuery(stsd => stsd.SubmissionTypeDocumentId == submissionDocumentId)
            .ToListAsync();

    public async Task<IEnumerable<SubmissionTypeInSubmissionDocumentInViewModel>> GetAllBySubmissionTypeIds(IEnumerable<int> submissionTypeIds)
    {
        var submissionTypeDocuments = await this.submissionTypesInSubmissionDocumentsDataService
            .GetQuery(stsd => submissionTypeIds.Contains(stsd.SubmissionTypeId))
            .GroupBy(stsd => stsd.SubmissionTypeDocument)
            .OrderBy(group => group.Key.OrderBy)
            .Select(group => new SubmissionTypeInSubmissionDocumentInViewModel
            {
                SubmissionTypeDocumentId = group.Key.Id,
                SubmissionTypeDocumentTitle = group.Key.Title,
                SubmissionTypeDocumentContent = group.Key.Content,
                SubmissionTypes = group.Select(stsd => stsd.SubmissionType.Name),
            })
            .ToListAsync();

        return submissionTypeDocuments;
    }

    public void Delete(SubmissionTypeInSubmissionDocument submissionTypeInSubmissionDocument)
        => this.submissionTypesInSubmissionDocumentsDataService.Delete(submissionTypeInSubmissionDocument);
}