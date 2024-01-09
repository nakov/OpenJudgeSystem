namespace OJS.Services.Ui.Business;

using System.Threading.Tasks;
using SoftUni.Services.Infrastructure;

public interface ILecturersInContestsBusinessService : IService
{
    Task<bool> IsCurrentUserAdminOrLecturerInContest(int? contestId);
}