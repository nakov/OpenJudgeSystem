namespace OJS.Servers.Administration.Controllers;

using FluentValidation;
using OJS.Data.Models.Mentor;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Business.MentorPromptTemplates;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.MentorPromptTemplates;

public class MentorPromptTemplatesController : BaseAdminApiController<MentorPromptTemplate, int, MentorPromptTemplateInListModel, MentorPromptTemplateAdministrationModel>
{
    public MentorPromptTemplatesController(
        IGridDataService<MentorPromptTemplate> gridDataService,
        IMentorPromptTemplateBusinessService mentorPromptTemplateBusinessService,
        IValidator<MentorPromptTemplateAdministrationModel> validator)
        : base(gridDataService, mentorPromptTemplateBusinessService, validator)
    {
    }
}