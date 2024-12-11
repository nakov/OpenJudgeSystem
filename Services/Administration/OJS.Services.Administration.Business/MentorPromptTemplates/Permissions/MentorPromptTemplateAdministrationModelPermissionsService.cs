namespace OJS.Services.Administration.Business.MentorPromptTemplates.Permissions;

using System.Threading.Tasks;
using OJS.Data.Models.Mentor;
using OJS.Services.Administration.Models.MentorPromptTemplates;
using OJS.Services.Common.Models.Users;

public class MentorPromptTemplateAdministrationModelPermissionsService : IEntityPermissionsService<MentorPromptTemplate, MentorPromptTemplateAdministrationModel>
{
    public Task<bool> HasPermission(UserInfoModel user, MentorPromptTemplateAdministrationModel value, string operation)
        => Task.FromResult(user.IsAdmin);
}