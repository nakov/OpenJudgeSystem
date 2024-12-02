namespace OJS.Services.Administration.Business.UsersMentors.Validators;

using System.Threading.Tasks;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OJS.Common.Enumerations;
using OJS.Data.Models.Mentor;
using OJS.Data.Models.Users;
using OJS.Services.Administration.Models.UsersMentors;
using OJS.Services.Common.Data;
using OJS.Services.Common.Validation;
using static OJS.Common.GlobalConstants.Settings;

public class UserMentorAdministrationValidator : BaseAdministrationModelValidator<UserMentorAdministrationModel, string, UserMentor>
{
    private readonly UserManager<UserProfile> userManager;
    private readonly IDataService<UserMentor> userMentorData;

    public UserMentorAdministrationValidator(
        IDataService<UserMentor> userMentorData,
        UserManager<UserProfile> userManager)
        : base(userMentorData)
    {
        this.userMentorData = userMentorData;
        this.userManager = userManager;

        this.RuleFor(model => model.Id)
            .MustAsync(async (id, _) => await this.userManager.FindByIdAsync(id) != null)
            .WithMessage("The user does not exist.")
            .When(model => model is { OperationType: CrudOperationType.Create } or { OperationType: CrudOperationType.Update });

        this.RuleFor(model => model.QuotaLimit)
            .Must(x => x is >= 0 and <= MentorQuotaLimit or null)
            .WithMessage($"The quota limit must be between 0 and {MentorQuotaLimit} (inclusive).")
            .When(model => model is { OperationType: CrudOperationType.Create } or { OperationType: CrudOperationType.Update });

        this.RuleFor(model => model)
            .MustAsync(async (model, _) => await this.HaveValidQuotaResetTime(model))
            .WithMessage($"The quota reset time must not exceed {MentorQuotaResetTimeInMinutes} minutes beyond the current reset time.")
            .When(model => model is { OperationType: CrudOperationType.Update });
    }

    private async Task<bool> HaveValidQuotaResetTime(UserMentorAdministrationModel model)
    {
        var userMentor = await this.userMentorData
            .GetByIdQuery(model.Id)
            .FirstOrDefaultAsync();

        if (userMentor is null)
        {
            return false;
        }

        return model.QuotaResetTime <= userMentor.QuotaResetTime.AddMinutes(MentorQuotaResetTimeInMinutes);
    }
}