namespace OJS.Services.Administration.Data.Implementations;

using Microsoft.EntityFrameworkCore;
using OJS.Data;
using OJS.Data.Models.Contests;
using System.Linq;
using System.Threading.Tasks;

public class ExamGroupsDataService : AdministrationDataService<ExamGroup>, IExamGroupsDataService
{
    public ExamGroupsDataService(OjsDbContext db)
        : base(db)
    {
    }

    public Task<int?> GetContestIdById(int id)
        => this.GetByIdQuery(id)
            .Select(eg => eg.ContestId)
            .FirstOrDefaultAsync();

    public IQueryable<ExamGroup> GetByIdWithUsersQuery(int id)
        => this.GetByIdQuery(id).Include(eg => eg.UsersInExamGroups);
}