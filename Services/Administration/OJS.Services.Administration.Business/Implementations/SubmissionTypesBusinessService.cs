namespace OJS.Services.Administration.Business.Implementations;

using OJS.Data.Models;
using OJS.Services.Administration.Data;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Threading.Tasks;

public class SubmissionTypesBusinessService : ISubmissionTypesBusinessService
{
    private readonly ISubmissionTypesDataService submissionTypesDataService;

    public SubmissionTypesBusinessService(ISubmissionTypesDataService submissionTypesDataService)
        => this.submissionTypesDataService = submissionTypesDataService;

    public async Task<SubmissionTypeInProblem> GetForProblem() =>
        await this.submissionTypesDataService.All().Map<SubmissionTypeInProblem>();
}