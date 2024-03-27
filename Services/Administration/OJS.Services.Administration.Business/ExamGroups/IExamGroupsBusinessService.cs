namespace OJS.Services.Administration.Business.ExamGroups;

using OJS.Data.Models.Contests;
using OJS.Services.Administration.Models.ExamGroups;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IExamGroupsBusinessService : IAdministrationOperationService<ExamGroup, int, ExamGroupAdministrationModel>
{
    Task<UserToExamGroupModel> AddUserToExamGroup(UserToExamGroupModel model);

    Task<MultipleUsersToExamGroupModel> AddMultipleUsersToExamGroup(MultipleUsersToExamGroupModel model);

    Task<UserToExamGroupModel> RemoveUserFromExamGroup(UserToExamGroupModel model);

    Task AddExternalUsersByIdAndUsernames(ExamGroup examGroup, IEnumerable<string> usernames);
}