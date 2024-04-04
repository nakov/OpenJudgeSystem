namespace OJS.Services.Administration.Business.SubmissionsForProcessing.Validation;

using FluentValidation;
using OJS.Common.Enumerations;
using OJS.Services.Administration.Models.SubmissionsForProcessing;
using OJS.Services.Common.Data;
using OJS.Services.Common.Validation;

public class SubmissionsForProcessingAdministrationModelValidator
    : BaseValidator<SubmissionsForProcessingAdministrationServiceModel>
{
    private readonly ISubmissionsForProcessingCommonDataService submissionsForProcessingDataService;

    public SubmissionsForProcessingAdministrationModelValidator(ISubmissionsForProcessingCommonDataService submissionsForProcessingDataService)
    {
        this.submissionsForProcessingDataService = submissionsForProcessingDataService;

        this.ClassLevelCascadeMode = CascadeMode.Stop;

        this.RuleFor(x => x.Id)
            .MustAsync(async (id, _)
                => await this.submissionsForProcessingDataService.ExistsById(id))
            .WithMessage($"Submission for processing with this id does not exists.")
            .When(model => model.OperationType is CrudOperationType.Delete or CrudOperationType.Read);
    }
}