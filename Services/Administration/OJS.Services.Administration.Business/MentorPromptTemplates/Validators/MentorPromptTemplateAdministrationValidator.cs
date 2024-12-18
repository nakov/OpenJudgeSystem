namespace OJS.Services.Administration.Business.MentorPromptTemplates.Validators;

using FluentValidation;
using OJS.Common.Enumerations;
using OJS.Data.Models.Mentor;
using OJS.Services.Administration.Models.MentorPromptTemplates;
using OJS.Services.Common.Data;
using OJS.Services.Common.Data.Validation;

using static OJS.Data.Validation.ConstraintConstants.MentorPromptTemplate;

public class MentorPromptTemplateAdministrationValidator : BaseAdministrationModelValidator<MentorPromptTemplateAdministrationModel, int, MentorPromptTemplate>
{
    public MentorPromptTemplateAdministrationValidator(
        IDataService<MentorPromptTemplate> mentorPromptTemplateData)
        : base(mentorPromptTemplateData)
    {
        this.RuleFor(model => model.Title)
            .Length(TitleMinLength, TitleMaxLength)
            .When(model => model.OperationType is CrudOperationType.Create or CrudOperationType.Update);
    }
}