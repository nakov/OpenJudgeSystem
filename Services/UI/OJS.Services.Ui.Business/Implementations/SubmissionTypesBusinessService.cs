using OJS.Services.Ui.Data;
using OJS.Services.Ui.Models.SubmissionTypes;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Collections.Generic;
using System.Threading.Tasks;
using X.PagedList;

namespace OJS.Services.Ui.Business.Implementations;

public class SubmissionTypesBusinessService : ISubmissionTypesBusinessService
{
    private ISubmissionTypesDataService submissionTypesDataService;

    public SubmissionTypesBusinessService(ISubmissionTypesDataService submissionTypesDataService)
        => this.submissionTypesDataService = submissionTypesDataService;

    public async Task<IEnumerable<SubmissionTypeServiceModel>> GetAllowedSubmissionTypes(int problemId)
        => await this.submissionTypesDataService
            .GetAllByProblem(problemId)
            .MapCollection<SubmissionTypeServiceModel>()
            .ToListAsync();

}