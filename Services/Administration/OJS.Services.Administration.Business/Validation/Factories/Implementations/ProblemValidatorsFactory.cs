namespace OJS.Services.Administration.Business.Validation.Factories.Implementations;

using AutoCrudAdmin.Models;
using AutoCrudAdmin.ViewModels;
using OJS.Common;
using OJS.Data.Models.Problems;
using OJS.Services.Administration.Business.Extensions;
using OJS.Services.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GeneralResource = OJS.Common.Resources.AdministrationGeneral;
using GlobalResource = OJS.Common.Resources.ProblemsController;

public class ProblemValidatorsFactory : IValidatorsFactory<Problem>
{
    private readonly IFileSystemService fileSystem;

    public ProblemValidatorsFactory(
        IFileSystemService fileSystem)
        => this.fileSystem = fileSystem;

    public IEnumerable<Func<Problem, Problem, AdminActionContext, ValidatorResult>> GetValidators()
        => new Func<Problem, Problem, AdminActionContext, ValidatorResult>[]
        {
            this.ValidateUploadedFiles,
            ValidateSubmissionTypeIsSelected,
        };

    public IEnumerable<Func<Problem, Problem, AdminActionContext, Task<ValidatorResult>>> GetAsyncValidators()
        => Enumerable.Empty<Func<Problem, Problem, AdminActionContext, Task<ValidatorResult>>>();

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