namespace OJS.Services.Administration.Business.SubmissionTypes;

using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.SubmissionTypes;
using OJS.Services.Administration.Models.SubmissionTypesInSubmissionDocuments;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Infrastructure.Extensions;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class SubmissionTypesBusinessService : AdministrationOperationService<SubmissionType, int, SubmissionTypeAdministrationModel>, ISubmissionTypesBusinessService
{
    private readonly ISubmissionTypesDataService submissionTypesDataService;

    public SubmissionTypesBusinessService(ISubmissionTypesDataService submissionTypesDataService)
        => this.submissionTypesDataService = submissionTypesDataService;

    public async Task<List<SubmissionTypesInProblemView>> GetForProblem() =>
        await this.submissionTypesDataService.GetAll().MapCollection<SubmissionTypesInProblemView>().ToListAsync();

    public async Task<List<SubmissionTypeInDocument>> GetForDocument()
        => await this.submissionTypesDataService.GetAll().MapCollection<SubmissionTypeInDocument>().ToListAsync();

    public async Task<bool> AllExist(IEnumerable<SubmissionTypeInSubmissionDocumentAdministrationModel> submissionTypes)
    {
        foreach (var submissionType in submissionTypes)
        {
            if (!await this.submissionTypesDataService.ExistsById(submissionType.SubmissionTypeId))
            {
                return false;
            }
        }

        return true;
    }

    public async Task<bool> ExistsById(int submissionTypeId)
        => await this.submissionTypesDataService
            .ExistsById(submissionTypeId);

    public override async Task<SubmissionTypeAdministrationModel> Get(int id) =>
         await this.submissionTypesDataService
             .GetByIdQuery(id)
             .MapCollection<SubmissionTypeAdministrationModel>()
             .FirstAsync();

    public override async Task<SubmissionTypeAdministrationModel> Create(SubmissionTypeAdministrationModel model)
    {
        var submissionType = model.Map<SubmissionType>();
        await this.submissionTypesDataService.Add(submissionType);
        await this.submissionTypesDataService.SaveChanges();

        return model;
    }

    public override async Task<SubmissionTypeAdministrationModel> Edit(SubmissionTypeAdministrationModel model)
    {
        var submissionType =
            await this.submissionTypesDataService
                .GetByIdQuery(model.Id)
                .Include(st => st.SubmissionTypesInProblems)
                .FirstOrDefaultAsync();

        if (submissionType == null)
        {
            throw new BusinessServiceException("Submission type not found.");
        }

        submissionType.MapFrom(model);
        this.submissionTypesDataService.Update(submissionType);
        await this.submissionTypesDataService.SaveChanges();

        return model;
    }

    public override async Task Delete(int id)
    {
        await this.submissionTypesDataService.DeleteById(id);
        await this.submissionTypesDataService.SaveChanges();
    }
}