namespace OJS.Services.Ui.Business
{
    using OJS.Services.Infrastructure;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public interface IExamGroupsBusinessService : IService
    {
        Task AddExternalUsersByIdAndUserIds(int id, IEnumerable<string> userIds);

        Task AddExternalUsersByIdAndUsernames(int id, IEnumerable<string> usernames);
    }
}