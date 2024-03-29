﻿namespace OJS.Services.Administration.Business.ExamGroups.Validators;

using FluentValidation;
using Microsoft.EntityFrameworkCore;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.ExamGroups;
using OJS.Services.Common.Validation;
using System.Threading.Tasks;

public class MultipleUsersToExamGroupModelValidator : BaseValidator<MultipleUsersToExamGroupModel>
{
    private readonly IExamGroupsDataService examGroupsDataService;

    public MultipleUsersToExamGroupModelValidator(IExamGroupsDataService examGroupsDataService)
    {
        this.examGroupsDataService = examGroupsDataService;
        this.RuleLevelCascadeMode = CascadeMode.Stop;
        this.RuleFor(x => x.ExamGroupId)
            .NotEmpty()
            .MustAsync(async (model, _) => await this.BeValidAndWithContest(model))
            .WithMessage("The problem group does not exists or does not have a contest connected to it.");
    }

    private async Task<bool> BeValidAndWithContest(int examGroupId)
    {
        var examGroup = await this.examGroupsDataService.GetByIdQuery(examGroupId).FirstOrDefaultAsync();
        if (examGroup == null || examGroup.ContestId == null)
        {
            return false;
        }

        return true;
    }
}