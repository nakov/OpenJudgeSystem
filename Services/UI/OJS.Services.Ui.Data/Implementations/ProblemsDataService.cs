namespace OJS.Services.Ui.Data.Implementations
{
    using OJS.Data;
    using OJS.Data.Models.Problems;
    using OJS.Services.Common.Data.Infrastructure.Implementations;

    public class ProblemsDataService : DataService<Problem>, IProblemsDataService
    {
        public ProblemsDataService(OjsDbContext db) : base(db)
        {
        }
    }
}