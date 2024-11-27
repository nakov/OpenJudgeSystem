namespace OJS.Services.Ui.Business.Implementations;

using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OJS.Services.Infrastructure.Exceptions;
using OJS.Services.Ui.Data;
using OJS.Services.Ui.Models.Problems;
using OJS.Services.Infrastructure.Extensions;

public class ProblemResourcesBusinessService(IProblemResourcesDataService problemResourcesDataService)
    : IProblemResourcesBusinessService
{
    public async Task<ProblemResourceServiceModel> GetResource(int resourceId)
        => await problemResourcesDataService
            .GetByIdQuery(resourceId)
            .AsNoTracking()
            .MapCollection<ProblemResourceServiceModel>()
            .FirstOrDefaultAsync()
            ?? throw new BusinessServiceException($"Problem resource with ID {resourceId} not found.");
}