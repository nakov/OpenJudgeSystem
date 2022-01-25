namespace OJS.Services.Administration.Business.Validation.Implementations;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Common;
using OJS.Data.Models.Contests;
using OJS.Data.Models.Problems;
using OJS.Services.Administration.Business.Extensions;
using OJS.Services.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GeneralResource = OJS.Common.Resources.AdministrationGeneral;
using GlobalResource = OJS.Common.Resources.ProblemsController;

public class ProblemsValidationService : IProblemsValidationService
{
    private readonly IUserProviderService userProvider;
    private readonly IContestsBusinessService contestsBusiness;
    private readonly IFileSystemService fileSystem;

    public ProblemsValidationService(
        IUserProviderService userProvider,
        IContestsBusinessService contestsBusiness,
        IFileSystemService fileSystem)
    {
        this.userProvider = userProvider;
        this.contestsBusiness = contestsBusiness;
        this.fileSystem = fileSystem;
    }

    public IEnumerable<Func<Problem, Problem, AdminActionContext, ValidatorResult>> GetValidators()
        => new Func<Problem, Problem, AdminActionContext, ValidatorResult>[]
        {
            this.ValidateUploadedFiles,
            ValidateSubmissionTypeIsSelected,
        };

    public IEnumerable<Func<Problem, Problem, AdminActionContext, Task<ValidatorResult>>> GetAsyncValidators()
        => new Func<Problem, Problem, AdminActionContext, Task<ValidatorResult>>[]
        {
            this.ValidateContestPermissions,
        };

    private async Task<ValidatorResult> ValidateContestPermissions(
        Problem existingEntity,
        Problem newEntity,
        AdminActionContext actionContext)
    {
        var user = this.userProvider.GetCurrentUser();
        var contestId = actionContext.TryGetEntityId<Contest>() ?? newEntity.ProblemGroup?.ContestId ?? default;

        if (contestId == default)
        {
            return ValidatorResult.Error("A contest should be specified for the problem.");
        }

        if (!await this.contestsBusiness.UserHasContestPermissions(contestId, user.Id, user.IsAdmin))
        {
            return ValidatorResult.Error(GeneralResource.No_permissions_for_contest);
        }

        return ValidatorResult.Success();
    }

    private ValidatorResult ValidateUploadedFiles(
        Problem existingEntity,
        Problem newEntity,
        AdminActionContext actionContext)
        => actionContext.Files.SingleFiles.Any(f => this.fileSystem.GetFileExtension(f) != GlobalConstants.FileExtensions.Zip)
            ? ValidatorResult.Error(GlobalResource.Must_be_zip_file)
            : ValidatorResult.Success();

    private static ValidatorResult ValidateSubmissionTypeIsSelected(
        Problem existingEntity,
        Problem newEntity,
        AdminActionContext actionContext)
        => actionContext.GetSubmissionTypes().Any(s => s.IsChecked)
            ? ValidatorResult.Success()
            : ValidatorResult.Error(GlobalResource.Select_one_submission_type);
}