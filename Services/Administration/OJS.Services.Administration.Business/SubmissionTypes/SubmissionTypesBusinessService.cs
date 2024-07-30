namespace OJS.Services.Administration.Business.SubmissionTypes;

using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.SubmissionTypes;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Infrastructure.Extensions;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

public class SubmissionTypesBusinessService : AdministrationOperationService<SubmissionType, int, SubmissionTypeAdministrationModel>, ISubmissionTypesBusinessService
{
    private readonly ISubmissionTypesDataService submissionTypesDataService;

    public SubmissionTypesBusinessService(ISubmissionTypesDataService submissionTypesDataService)
        => this.submissionTypesDataService = submissionTypesDataService;

    public async Task<List<SubmissionTypesInProblemView>> GetForProblem() =>
        await this.submissionTypesDataService.GetAll().MapCollection<SubmissionTypesInProblemView>().ToListAsync();

    public async Task<string> ReplaceSubmissionType(ReplaceSubmissionTypeServiceModel model)
    {
        var stringBuilder = new StringBuilder();
        Console.WriteLine();

        var submissionType = await this.submissionTypesDataService
            .GetByIdQuery(model.SubmissionTypeToReplace)
            .FirstOrDefaultAsync();

        if (submissionType == null)
        {
            throw new BusinessServiceException($"Submission type {model.SubmissionTypeToReplace} does not exist");
        }

        SubmissionType? submissionTypeToReplaceWith = null;

        if (model.SubmissionTypeToReplaceWith.HasValue)
        {
            submissionTypeToReplaceWith = await this.submissionTypesDataService
                .GetByIdQuery(model.SubmissionTypeToReplaceWith)
                .FirstOrDefaultAsync();
        }

        if (submissionTypeToReplaceWith != null)
        {
            stringBuilder.Append(
                $"Submission type {submissionType.Name} will be replaced with {submissionTypeToReplaceWith.Name}");
        }
        else
        {
            stringBuilder.Append(
                $"Submission type {submissionType.Name} will be deleted");
        }

        return stringBuilder.ToString();
    }

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