namespace OJS.Services.Administration.Business.Users.Validators;

using FluentValidation;
using OJS.Services.Administration.Models.Users;
using OJS.Services.Common.Validation;
using static OJS.Data.Validation.ConstraintConstants.User;

public class UserAdministrationModelValidator : BaseValidator<UserAdministrationModel>
{
    public UserAdministrationModelValidator()
    {
        this.RuleFor(x => x.Id)
            .NotEmpty();

        this.RuleFor(x => x.UserName)
            .NotEmpty();

        this.RuleFor(x => x.Email)
            .Length(EmailMinLength, EmailMaxLength)
            .Matches(EmailRegEx);

        this.RuleFor(x => x.UserSettings!.FirstName)
            .Length(NameMinLength, NameMaxLength);

        this.RuleFor(x => x.UserSettings!.LastName)
            .MaximumLength(NameMaxLength);

        this.RuleFor(x => x.UserSettings!.City)
            .Length(CityMinLength, CityMaxLength);

        this.RuleFor(x => x.UserSettings!.FacultyNumber)
            .MaximumLength(FacultyNumberMaxLength);

        this.RuleFor(x => x.UserSettings!.Company)
            .Length(CompanyMinLength, CompanyMaxLength);

        this.RuleFor(x => x.UserSettings!.JobTitle)
            .Length(JobTitleMinLength, JobTitleMaxLength);
    }
}