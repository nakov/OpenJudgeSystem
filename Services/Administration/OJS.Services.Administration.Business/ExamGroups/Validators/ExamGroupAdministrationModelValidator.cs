namespace OJS.Services.Administration.Business.ExamGroups.Validators;

using FluentValidation;
using Microsoft.EntityFrameworkCore;
using OJS.Common.Enumerations;
using OJS.Data.Models.Contests;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.ExamGroups;
using OJS.Services.Common.Validation;
using System.Threading.Tasks;
using static OJS.Data.Validation.ConstraintConstants.ExamGroup;

public class ExamGroupAdministrationModelValidator : BaseAdministrationModelValidator<ExamGroupAdministrationModel, int, ExamGroup>
{
    private readonly IContestsDataService contestsDataService;
    private readonly IExamGroupsDataService examGroupsDataService;

    public ExamGroupAdministrationModelValidator(IContestsDataService contestsDataService, IExamGroupsDataService examGroupsDataService)
        : base(examGroupsDataService)
    {
        this.contestsDataService = contestsDataService;
        this.examGroupsDataService = examGroupsDataService;

        this.RuleFor(x => x.Name)
            .Length(NameMinLength, NameMaxLength)
            .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);

        this.RuleFor(x => x.ContestId)
            .GreaterThanOrEqualTo(0)
            .When(x => x.ContestId.HasValue)
            .MustAsync(async (id, _)
                => await this.BeValidContest(id))
            .WithMessage("Contest with this id does not exists.")
            .When(model => model.ContestId.HasValue && model.OperationType is CrudOperationType.Create or CrudOperationType.Update);

        this.RuleFor(x => x.Id)
            .MustAsync(async (model, _) => await this.NotHaveActiveContest(model))
            .WithMessage("Cannot delete exam group from active contest.")
            .When(x => x.OperationType is CrudOperationType.Delete);
    }

    private async Task<bool> BeValidContest(int? id)
        => await this.contestsDataService.ExistsById(id!.Value);

    private async Task<bool> NotHaveActiveContest(int examGroupId)
    {
        var examGroup = await this.examGroupsDataService.GetByIdQuery(examGroupId).FirstAsync();

        return examGroup.ContestId == null || !await this.contestsDataService.IsActiveById((int)examGroup.ContestId);
    }
}