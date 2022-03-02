namespace OJS.Services.Administration.Business.Validation.Factories.Implementations;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Common;
using OJS.Data.Models.Contests;
using OJS.Data.Models.Problems;
using OJS.Services.Administration.Business.Extensions;
using OJS.Services.Administration.Business.Validation.Helpers;
using OJS.Services.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GeneralResource = OJS.Common.Resources.AdministrationGeneral;
using GlobalResource = OJS.Common.Resources.ProblemsController;

public class ProblemValidatorsFactory : IProblemValidatorsFactory
{
    private readonly IContestsValidationHelper contestsValidationHelper;
    private readonly IFileSystemService fileSystem;

    public ProblemValidatorsFactory(
        IContestsValidationHelper contestsValidationHelper,
        IFileSystemService fileSystem)
    {
        this.contestsValidationHelper = contestsValidationHelper;
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
        var contestId = actionContext.TryGetEntityId<Contest>() ?? newEntity.ProblemGroup.ContestId;

        var permissionsResult = await this.contestsValidationHelper.ValidatePermissionsOfCurrentUser(
            contestId);

        return permissionsResult.IsValid
            ? ValidatorResult.Success()
            : ValidatorResult.Error(GeneralResource.No_permissions_for_contest);
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