namespace OJS.Services.Administration.Business.Users;

using OJS.Data.Models.Users;
using OJS.Services.Administration.Models.ExamGroups;
using OJS.Services.Administration.Models.Users;
using System.Threading.Tasks;

public interface IUsersBusinessService : IAdministrationOperationService<UserProfile, string, UserAdministrationModel>
{
}