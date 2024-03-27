namespace OJS.Services.Administration.Business.ExamGroups.Validators;

using FluentValidation;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.ExamGroups;
using OJS.Services.Common.Validation;

public class MultipleUsersToExamGroupModelValidator : BaseValidator<MultipleUsersToExamGroupModel>
{
    private readonly IExamGroupsDataService examGroupsDataService;

    public MultipleUsersToExamGroupModelValidator(IExamGroupsDataService examGroupsDataService)
    {
        this.examGroupsDataService = examGroupsDataService;
        this.RuleLevelCascadeMode = CascadeMode.Stop;
        this.RuleFor(x => x.ExamGroupId)
            .NotEmpty()
            .MustAsync(async (model, _) => await this.examGroupsDataService.ExistsById(model));
    }
}