namespace OJS.Services.Administration.Business.ExamGroups.Validators;

using FluentValidation;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.ExamGroups;
using OJS.Services.Common.Validation;
using System.Threading.Tasks;
using static OJS.Data.Validation.ConstraintConstants.ExamGroup;

public class ExamGroupAdministrationModelValidator : BaseValidator<ExamGroupAdministrationModel>
{
    private readonly IContestsDataService contestsDataService;

    public ExamGroupAdministrationModelValidator(IContestsDataService contestsDataService)
    {
        this.contestsDataService = contestsDataService;

        this.ClassLevelCascadeMode = CascadeMode.Stop;

        this.RuleFor(x => x.Id)
            .GreaterThanOrEqualTo(0);

        this.RuleFor(x => x.Name)
            .Length(NameMinLength, NameMaxLength);

        this.RuleFor(x => x.ContestId)
            .GreaterThanOrEqualTo(0)
            .MustAsync(async (id, _)
                => await this.BeValidContest(id));
    }

    private async Task<bool> BeValidContest(int id)
        => await this.contestsDataService.ExistsById(id);
}