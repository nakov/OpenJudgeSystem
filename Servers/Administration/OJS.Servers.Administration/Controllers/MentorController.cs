namespace OJS.Servers.Administration.Controllers;

using FluentValidation;
using OJS.Data.Models;
using OJS.Data.Models.Mentor;
using OJS.Services.Administration.Business.UsersMentors;
using OJS.Services.Administration.Data;
using OJS.Services.Administration.Models.UsersMentors;
using OJS.Services.Common.Data;

public class MentorController : BaseAdminApiController<UserMentor, string, UserMentorInListModel, UserMentorAdministrationModel>
{
    public MentorController(
        IGridDataService<UserMentor> gridDataService,
        IUsersMentorsBusinessService usersMentorsBusinessService,
        IValidator<UserMentorAdministrationModel> validator,
        IDataService<AccessLog> accessLogsData)
        : base(
            gridDataService,
            usersMentorsBusinessService,
            validator,
            accessLogsData)
    {
    }
}