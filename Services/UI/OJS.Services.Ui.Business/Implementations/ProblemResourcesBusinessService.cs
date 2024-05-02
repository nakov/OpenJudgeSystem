namespace OJS.Services.Ui.Business.Implementations;

using System.Threading.Tasks;
using FluentExtensions.Extensions;
using OJS.Services.Ui.Data;
using OJS.Services.Ui.Models.Problems;
using OJS.Services.Infrastructure.Extensions;

public class ProblemResourcesBusinessService : IProblemResourcesBusinessService
{
    private IProblemResourcesDataService problemResourcesDataService;

    public ProblemResourcesBusinessService(IProblemResourcesDataService problemResourcesDataService)
        => this.problemResourcesDataService = problemResourcesDataService;

    public async Task<ProblemResourceServiceModel> GetResource(int resourceId)
        => await this.problemResourcesDataService
            .OneById(resourceId)
            .MapCollection<ProblemResourceServiceModel>()
            .FirstOrDefaultAsync();
}