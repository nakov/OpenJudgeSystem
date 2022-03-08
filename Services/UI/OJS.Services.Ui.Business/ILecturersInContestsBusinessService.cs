using OJS.Data.Models.Contests;
using SoftUni.Services.Infrastructure;

namespace OJS.Services.Ui.Business;

public interface ILecturersInContestsBusinessService : IService
{
    bool IsUserAdminOrLecturerInContest(Contest contest);
}