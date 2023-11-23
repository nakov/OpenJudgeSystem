namespace OJS.Services.Ui.Business;

using OJS.Data.Models.Contests;
using SoftUni.Services.Infrastructure;

public interface ILecturersInContestsBusinessService : IService
{
    bool IsUserAdminOrLecturerInContest(Contest? contest);

    bool IsUserAdminOrLecturerInContest(int contestId);

    bool IsUserLecturerInContest(Contest contest);
}