namespace OJS.Services.Administration.Business.Contests.Validators;

using FluentValidation;
using Microsoft.EntityFrameworkCore;
using OJS.Common.Enumerations;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Contests;
using OJS.Services.Common;
using OJS.Services.Common.Models.Contests;
using OJS.Services.Common.Validation;
using SoftUni.AutoMapper.Infrastructure.Extensions;
using System;
using System.Threading.Tasks;

public class ContestAdministrationModelValidator : BaseValidator<ContestAdministrationModel>
{
    private const int ProblemGroupsCountLimit = 40;
    private readonly IContestsActivityService activityService;
    private readonly IContestsDataService contestService;

    public ContestAdministrationModelValidator(
        IContestsActivityService activityService,
        IContestsDataService contestService)
    {
        this.activityService = activityService;
        this.contestService = contestService;
        this.RuleFor(model => model.Name)
            .Length(4, 100);

        this.RuleFor(model => model.EndTime)
            .GreaterThan(model => model.StartTime)
            .When(model => model.StartTime.HasValue)
            .WithMessage("End Time must be greater than Start Time");

        this.RuleFor(model => model.PracticeEndTime).GreaterThan(model => model.PracticeStartTime)
            .When(model => model.PracticeStartTime.HasValue)
            .WithMessage("Practice end time must be greater than Practice start time");

        this.RuleFor(model => model.Type)
            .NotNull()
            .NotEmpty()
            .Must(BeAValidContestType)
            .WithMessage("There is no contest type with this value");

        this.RuleFor(model => model)
            .MustAsync(async (model, _)
                => await this.ValidateActiveContestCannotEditDurationTypeOnEdit(model))
            .When(model => model.Id > 0)
            .WithName("Duration")
            .NotNull()
            .WithMessage("Cannot change duration or type in an active contest.");

        this.RuleFor(model => model)
            .Must(ValidateOnlineContestProblemGroups)
            .When(model => model.Id <= 0 && model.Type == ContestType.OnlinePracticalExam.ToString())
            .WithName("Number of problem groups")
            .NotNull()
            .WithMessage($"The number of problem groups cannot be less than 0 and more than {ProblemGroupsCountLimit}");
    }

    private static bool BeAValidContestType(string? type)
    {
        var isValid = Enum.TryParse<ContestType>(type, true, out _);
        return isValid;
    }

    private static bool ValidateOnlineContestProblemGroups(ContestAdministrationModel model)
    {
        if (model.IsOnlineExam)
        {
            if (model.NumberOfProblemGroups <= 0)
            {
                return false;
            }

            if (model.NumberOfProblemGroups > ProblemGroupsCountLimit)
            {
                return false;
            }
        }

        return true;
    }

    private async Task<bool> ValidateActiveContestCannotEditDurationTypeOnEdit(ContestAdministrationModel model)
    {
        var contest = await this.contestService.GetByIdQuery(model.Id).FirstOrDefaultAsync();
        if (contest is null)
        {
            return false;
        }

        var isActive = await this.activityService.IsContestActive(contest.Map<ContestForActivityServiceModel>());

        if (string.IsNullOrEmpty(model.Type))
        {
            return false;
        }

        var isValid = Enum.TryParse(model.Type, true, out ContestType contestType);
        if (!isValid)
        {
            return false;
        }

        return !isActive ||
               (contest.Duration == model.Duration &&
                contest.Type == contestType);
    }

    private async Task ValidateContestExists(ContestAdministrationModel model)
    {
        var contest = await this.contestService.GetByIdQuery(model.Id).FirstOrDefaultAsync();

        if (contest is null)
        {
            throw new ArgumentNullException($"Contest with Id:{model.Id} not found");
        }
    }
}