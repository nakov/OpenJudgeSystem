namespace OJS.Services.Ui.Business;

using System.Threading.Tasks;
using OJS.Data.Models.Contests;
using SoftUni.Services.Infrastructure;

public interface ILecturersInContestsBusinessService : IService
{
    bool IsUserAdminOrLecturerInContest(Contest? contest);

    bool IsUserLecturerInContest(Contest contest);

    Task<bool> IsUserAdminOrLecturerInContestByProblem(int problemId);
}