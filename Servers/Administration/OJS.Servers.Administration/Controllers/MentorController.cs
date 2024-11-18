namespace OJS.Servers.Administration.Controllers;

using FluentValidation;
using OJS.Data.Models.Mentor;
using OJS.Services.Administration.Business;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.UsersMentors;

public class MentorController : BaseAdminApiController<UserMentor, string, UserMentorInListModel, UserMentorAdministrationModel>
{
    public MentorController(
        IGridDataService<UserMentor> gridDataService,
        IAdministrationOperationService<UserMentor, string, UserMentorAdministrationModel> operationService,
        IValidator<UserMentorAdministrationModel> validator)
        : base(gridDataService, operationService, validator)
    {
    }
}