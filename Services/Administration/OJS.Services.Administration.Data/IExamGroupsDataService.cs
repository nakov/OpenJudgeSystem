namespace OJS.Services.Administration.Data;

using OJS.Data.Models.Contests;
using OJS.Services.Common.Data;
using System.Linq;
using System.Threading.Tasks;

public interface IExamGroupsDataService : IDataService<ExamGroup>
{
    Task<int?> GetContestIdById(int id);
    IQueryable<ExamGroup> GetByIdWithUsersQuery(int id);
}