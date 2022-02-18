namespace OJS.Services.Administration.Business.Validation;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Data.Models.Contests;
using System.Threading.Tasks;

public interface IContestsValidationService : IValidationService<Contest>
{
    Task<ValidatorResult> ValidateContestPermissionsOfCurrentUser(AdminActionContext actionContext);
}