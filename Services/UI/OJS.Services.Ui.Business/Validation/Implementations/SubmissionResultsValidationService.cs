﻿namespace OJS.Services.Ui.Business.Validation.Implementations;

using OJS.Data.Models.Participants;
using OJS.Data.Models.Problems;
using OJS.Services.Common.Models;
using OJS.Services.Common.Models.Users;

public class SubmissionResultsValidationService : ISubmissionResultsValidationService
{
    public ValidationResult GetValidationResult((UserInfoModel, Problem?, Participant?, bool) validationInput)
    {
        var (userInfoModel, problem, participant, isOfficial) = validationInput;

        if (problem == null)
        {
            return ValidationResult.Invalid(ValidationMessages.Problem.NotFound);
        }

        if (participant == null && !userInfoModel.IsAdminOrLecturer && isOfficial)
        {
            return ValidationResult.Invalid(ValidationMessages.Participant.NotRegisteredForExam);
        }

        if (!problem.ShowResults && !userInfoModel.IsAdminOrLecturer)
        {
            return ValidationResult.Invalid(ValidationMessages.Problem.ProblemResultsNotAvailable);
        }

        return ValidationResult.Valid();
    }
}