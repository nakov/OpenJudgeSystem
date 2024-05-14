namespace OJS.Services.Ui.Business
{
    using OJS.Services.Infrastructure;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public interface IExamGroupsBusinessService : IService
    {
        Task AddUsersByIdAndUserIds(int id, IEnumerable<string> userIds);

        Task AddUsersByIdAndUsernames(int id, IEnumerable<string> usernames);

        Task RemoveUsersByIdAndUserIds(int id, IEnumerable<string> userIds);

        Task AddExternalUsersByIdAndUserIds(int id, IEnumerable<string> userIds);

        Task AddExternalUsersByIdAndUsernames(int id, IEnumerable<string> usernames);
    }
}