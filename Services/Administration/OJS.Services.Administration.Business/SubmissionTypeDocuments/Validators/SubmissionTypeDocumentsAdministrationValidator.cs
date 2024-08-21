namespace OJS.Services.Administration.Business.SubmissionTypeDocuments.Validators;

using FluentValidation;
using OJS.Common.Enumerations;
using OJS.Data.Models.Submissions;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.SubmissionTypeDocuments;
using OJS.Services.Common.Validation;

using static OJS.Data.Validation.ConstraintConstants.SubmissionTypeDocuments;
public class SubmissionTypeDocumentsAdministrationValidator : BaseAdministrationModelValidator<SubmissionTypeDocumentAdministrationModel, int, SubmissionTypeDocument>
{
    public SubmissionTypeDocumentsAdministrationValidator(
        ISubmissionTypeDocumentsDataService submissionTypeDocumentsDataService)
        : base(submissionTypeDocumentsDataService)
    {
        this.RuleFor(model => model.Title)
            .Must(title => title.Length is >= TitleMinLength and <= TitleMaxLength)
            .WithMessage($"The submission type document's title must be between {TitleMinLength} and {TitleMaxLength} characters.")
            .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);

        this.RuleFor(model => model.SubmissionTypesInSubmissionDocuments)
            .Must(submissionTypes => submissionTypes.Count > 0)
            .WithMessage("One or more submission types must be selected for the submission type document")
            .When(x => x.OperationType is CrudOperationType.Create or CrudOperationType.Update);
    }
}