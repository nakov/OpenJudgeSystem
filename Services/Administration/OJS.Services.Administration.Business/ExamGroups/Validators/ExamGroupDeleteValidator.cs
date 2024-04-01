namespace OJS.Services.Administration.Business.ExamGroups.Validators;

using FluentValidation;
using Microsoft.EntityFrameworkCore;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Validation;
using System.Threading.Tasks;

public class ExamGroupDeleteValidator : BaseDeleteValidator<BaseDeleteValidationModel<int>, int>
{
    private readonly IExamGroupsDataService examGroupsDataService;
    private readonly IContestsDataService contestsDataService;

    public ExamGroupDeleteValidator(IExamGroupsDataService examGroupsDataService, IContestsDataService contestsDataService)
    {
        this.examGroupsDataService = examGroupsDataService;
        this.contestsDataService = contestsDataService;

        this.RuleFor(x => x.Id)
            .MustAsync(async (model, _) => await this.NotHaveActiveContest(model))
            .WithMessage("Cannot delete exam group from active contest.");
    }

    private async Task<bool> NotHaveActiveContest(int examGroupId)
    {
        var examGroup = await this.examGroupsDataService.GetByIdQuery(examGroupId).FirstAsync();

        return examGroup.ContestId == null || !await this.contestsDataService.IsActiveById((int)examGroup.ContestId);
    }
}