namespace OJS.Services.Administration.Business.Validation.Implementations;

using OJS.Services.Administration.Models.ProblemResources;
using OJS.Services.Common.Models;
using OJS.Services.Common.Validation;
using OJS.Services.Common.Validation.Helpers;
using OJS.Services.Infrastructure;
using OJS.Services.Infrastructure.Models;

public class ProblemResourcesDownloadValidationService : IValidationService<ProblemResourceDownloadServiceModel>
{
    private readonly INotDefaultValueValidationHelper notDefaultValueValidationHelper;

    public ProblemResourcesDownloadValidationService(
        INotDefaultValueValidationHelper notDefaultValueValidationHelper)
        => this.notDefaultValueValidationHelper = notDefaultValueValidationHelper;

    public ValidationResult GetValidationResult(ProblemResourceDownloadServiceModel? resource)
        => this.notDefaultValueValidationHelper
            .ValidateValueIsNotDefault(resource, nameof(resource));
}