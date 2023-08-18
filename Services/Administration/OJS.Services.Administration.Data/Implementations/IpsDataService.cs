namespace OJS.Services.Administration.Data.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Data;
    using OJS.Data.Models;
    using OJS.Services.Common.Data.Implementations;
    using System.Threading.Tasks;

    public class IpsDataService : DataService<Ip>, IIpsDataService
    {
        public IpsDataService(OjsDbContext db)
            : base(db)
        {
        }

        public Task<Ip?> GetByValue(string value)
            => this.DbSet
                .FirstOrDefaultAsync(ip => ip.Value == value);
    }
}