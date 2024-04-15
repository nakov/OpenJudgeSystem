﻿namespace OJS.Services.Administration.Business.SubmissionsForProcessing.Validation;

using FluentValidation;
using OJS.Common.Enumerations;
using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Models.SubmissionsForProcessing;
using OJS.Services.Common.Data;
using OJS.Services.Common.Validation;

public class SubmissionsForProcessingAdministrationModelValidator
    : BaseAdministrationModelValidator<SubmissionsForProcessingAdministrationServiceModel, int, SubmissionForProcessing>
{
    public SubmissionsForProcessingAdministrationModelValidator(ISubmissionsForProcessingCommonDataService submissionsForProcessingDataService)
        : base(submissionsForProcessingDataService)
    {
    }
}