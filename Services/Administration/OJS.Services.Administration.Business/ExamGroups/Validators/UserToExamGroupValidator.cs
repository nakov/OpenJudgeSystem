namespace OJS.Services.Administration.Business.ExamGroups.Validators;

using FluentValidation;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.ExamGroups;
using OJS.Services.Common.Validation;

public class UserToExamGroupValidator : BaseValidator<UserToExamGroupModel>
{
    private readonly IExamGroupsDataService examGroupsDataService;

    public UserToExamGroupValidator(IExamGroupsDataService examGroupsDataService)
    {
        this.examGroupsDataService = examGroupsDataService;
        this.ClassLevelCascadeMode = CascadeMode.Stop;
        this.RuleFor(x => x.UserId)
            .NotEmpty();

        this.RuleFor(x => x.ExamGroupId)
            .GreaterThan(0)
            .MustAsync(async (model, _)
                => await this.examGroupsDataService.ExistsById(model))
            .WithMessage("Exam group does not exists.");
    }
}