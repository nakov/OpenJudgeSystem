namespace OJS.Services.Ui.Business;

using System.Threading.Tasks;
using OJS.Data.Models.Contests;
using SoftUni.Services.Infrastructure;

public interface ILecturersInContestsBusinessService : IService
{
    bool IsUserAdminOrLecturerInContest(Contest? contest);

    Task<bool> IsUserAdminOrLecturerInContest(int contestId);

    bool IsUserLecturerInContest(Contest contest);
}