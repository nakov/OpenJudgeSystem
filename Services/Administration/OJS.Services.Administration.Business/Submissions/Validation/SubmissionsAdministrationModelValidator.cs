namespace OJS.Services.Administration.Business.Submissions.Validation;

using FluentValidation;
using OJS.Common.Enumerations;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Submissions;
using OJS.Services.Common.Validation;

public class SubmissionsAdministrationModelValidator : BaseValidator<SubmissionAdministrationServiceModel>
{
    private readonly ISubmissionsDataService submissionsDataService;

    public SubmissionsAdministrationModelValidator(ISubmissionsDataService submissionsDataService)
    {
        this.submissionsDataService = submissionsDataService;

        this.ClassLevelCascadeMode = CascadeMode.Stop;

        this.RuleFor(x => x.Id)
            .MustAsync(async (id, _)
                => await this.submissionsDataService.ExistsById(id))
            .WithMessage($"Submission with this id does not exists.")
            .When(model => model.OperationType is CrudOperationType.Delete or CrudOperationType.Read);
    }
}