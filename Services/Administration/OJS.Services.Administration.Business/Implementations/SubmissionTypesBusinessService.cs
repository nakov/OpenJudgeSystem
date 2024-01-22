namespace OJS.Services.Administration.Business.Implementations;

using OJS.Services.Administration.Data;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Threading.Tasks;
using OJS.Services.Administration.Models.SubmissionTypes;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

public class SubmissionTypesBusinessService : ISubmissionTypesBusinessService
{
    private readonly ISubmissionTypesDataService submissionTypesDataService;

    public SubmissionTypesBusinessService(ISubmissionTypesDataService submissionTypesDataService)
        => this.submissionTypesDataService = submissionTypesDataService;

    public async Task<List<SubmissionTypesInProblemView>> GetForProblem() =>
        await this.submissionTypesDataService.GetAll().MapCollection<SubmissionTypesInProblemView>().ToListAsync();
}