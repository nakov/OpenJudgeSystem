namespace OJS.Services.Administration.Business.MentorPromptTemplates.Permissions;

using System.Threading.Tasks;
using OJS.Data.Models.Mentor;
using OJS.Services.Common.Models.Users;

public class MentorPromptTemplateIdPermissionsService : IEntityPermissionsService<MentorPromptTemplate, int>
{
    public Task<bool> HasPermission(UserInfoModel user, int value, string operation)
        => Task.FromResult(user.IsAdmin);
}