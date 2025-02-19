namespace OJS.Services.Ui.Business.Cache;

using OJS.Services.Common.Models.Users;
using OJS.Services.Infrastructure;
using System.Threading.Tasks;

public interface ILecturersInContestsCacheService : IService
{
    Task<bool> IsUserAdminOrLecturerInContest(int? contestId, int? categoryId, UserInfoModel? user);
}