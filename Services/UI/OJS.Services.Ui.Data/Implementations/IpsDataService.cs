namespace OJS.Services.Ui.Data.Implementations
{
    using OJS.Data;
    using OJS.Data.Models;
    using OJS.Services.Common.Data.Infrastructure.Implementations;

    public class IpsDataService : DataService<Ip>, IIpsDataService
    {
        public IpsDataService(OjsDbContext db) : base(db)
        {
        }
    }
}