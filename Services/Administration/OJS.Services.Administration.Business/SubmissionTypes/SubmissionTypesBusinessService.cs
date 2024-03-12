namespace OJS.Services.Administration.Business.SubmissionTypes;

using Microsoft.EntityFrameworkCore;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.SubmissionTypes;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Collections.Generic;
using System.Threading.Tasks;
using OJS.Data.Models.Submissions;

public class SubmissionTypesBusinessService : AdministrationOperationService<SubmissionType, int, SubmissionTypesAdministrationModel>, ISubmissionTypesBusinessService
{
    private readonly ISubmissionTypesDataService submissionTypesDataService;

    public SubmissionTypesBusinessService(ISubmissionTypesDataService submissionTypesDataService)
        => this.submissionTypesDataService = submissionTypesDataService;

    public async Task<List<SubmissionTypesInProblemView>> GetForProblem() =>
        await this.submissionTypesDataService.GetAll().MapCollection<SubmissionTypesInProblemView>().ToListAsync();

    public override Task<SubmissionTypesAdministrationModel> Get(int id) =>
        this.submissionTypesDataService.GetByIdQuery(id).FirstOrDefaultAsync()
            .Map<SubmissionTypesAdministrationModel>();
}