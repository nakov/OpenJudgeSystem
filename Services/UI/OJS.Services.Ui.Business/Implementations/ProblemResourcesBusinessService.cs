using FluentExtensions.Extensions;
using OJS.Services.Ui.Data;
using OJS.Services.Ui.Models.Problems;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System.Threading.Tasks;

namespace OJS.Services.Ui.Business.Implementations;

public class ProblemResourcesBusinessService : IProblemResourcesBusinessService
{
    private IProblemResourcesDataService problemResourcesDataService;

    public ProblemResourcesBusinessService(IProblemResourcesDataService problemResourcesDataService)
        => this.problemResourcesDataService = problemResourcesDataService;

    public async Task<ProblemResourceServiceModel> GetResource(int resourceId)
        => await problemResourcesDataService
            .OneById(resourceId)
            .MapCollection<ProblemResourceServiceModel>()
            .FirstOrDefaultAsync();
}