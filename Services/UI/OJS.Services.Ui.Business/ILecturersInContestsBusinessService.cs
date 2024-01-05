namespace OJS.Services.Ui.Business;

using SoftUni.Services.Infrastructure;
using System.Threading.Tasks;

public interface ILecturersInContestsBusinessService : IService
{
    Task<bool> IsCurrentUserAdminOrLecturerInContest(int? contestId);
}