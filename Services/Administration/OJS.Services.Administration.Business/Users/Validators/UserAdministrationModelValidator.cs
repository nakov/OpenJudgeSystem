namespace OJS.Services.Administration.Business.Users.Validators;

using FluentValidation;
using OJS.Common.Enumerations;
using OJS.Data.Models.Users;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.Users;
using OJS.Services.Common.Validation;
using static OJS.Data.Validation.ConstraintConstants.User;

public class UserAdministrationModelValidator : BaseAdministrationModelValidator<UserAdministrationModel, string, UserProfile>
{
    public UserAdministrationModelValidator(IUsersDataService usersDataService)
        : base(usersDataService)
    {
        this.RuleFor(x => x.UserName)
            .NotEmpty()
            .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);

        this.RuleFor(x => x.Email)
            .Length(EmailMinLength, EmailMaxLength)
            .Matches(EmailRegEx)
            .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);

        this.RuleFor(x => x.UserSettings!.FirstName)
            .Length(NameMinLength, NameMaxLength)
            .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);

        this.RuleFor(x => x.UserSettings!.LastName)
            .MaximumLength(NameMaxLength)
            .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);

        this.RuleFor(x => x.UserSettings!.City)
            .Length(CityMinLength, CityMaxLength)
            .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);

        this.RuleFor(x => x.UserSettings!.FacultyNumber)
            .MaximumLength(FacultyNumberMaxLength)
            .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);

        this.RuleFor(x => x.UserSettings!.Company)
            .Length(CompanyMinLength, CompanyMaxLength)
            .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);

        this.RuleFor(x => x.UserSettings!.JobTitle)
            .Length(JobTitleMinLength, JobTitleMaxLength)
            .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);
    }
}