namespace OJS.Services.Administration.Data.Implementations;

using OJS.Data;
using OJS.Data.Models.Checkers;

public class CheckersDataService : AdministrationDataService<Checker>, ICheckersDataService
{
    public CheckersDataService(OjsDbContext db)
        : base(db)
    {
    }
}