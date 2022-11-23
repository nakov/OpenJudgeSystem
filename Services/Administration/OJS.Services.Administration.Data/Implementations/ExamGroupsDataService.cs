namespace OJS.Services.Administration.Data.Implementations;

using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Contests;
using OJS.Services.Common.Data.Implementations;
using System.Linq;
using System.Threading.Tasks;

public class ExamGroupsDataService : DataService<ExamGroup>, IExamGroupsDataService
{
    public ExamGroupsDataService(DbContext db)
        : base(db)
    {
    }

    public Task<int?> GetContestIdById(int id)
        => this.GetByIdQuery(id)
            .Select(eg => eg.ContestId)
            .FirstOrDefaultAsync();
}