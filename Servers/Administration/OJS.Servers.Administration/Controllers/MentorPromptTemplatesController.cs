namespace OJS.Servers.Administration.Controllers;

using FluentValidation;
using OJS.Data.Models;
using OJS.Data.Models.Mentor;
using OJS.Services.Administration.Business.MentorPromptTemplates;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.MentorPromptTemplates;
using OJS.Services.Common.Data;

public class MentorPromptTemplatesController : BaseAdminApiController<MentorPromptTemplate, int, MentorPromptTemplateInListModel, MentorPromptTemplateAdministrationModel>
{
    public MentorPromptTemplatesController(
        IGridDataService<MentorPromptTemplate> gridDataService,
        IMentorPromptTemplateBusinessService mentorPromptTemplateBusinessService,
        IValidator<MentorPromptTemplateAdministrationModel> validator,
        IDataService<AccessLog> accessLogsData)
        : base(
            gridDataService,
            mentorPromptTemplateBusinessService,
            validator,
            accessLogsData)
    {
    }
}