namespace OJS.Services.Administration.Data.Implementations
{
    using OJS.Data;
    using OJS.Data.Models;
    using System.Threading.Tasks;

    public class IpsDataService : AdministrationDataService<Ip>, IIpsDataService
    {
        public IpsDataService(OjsDbContext db)
            : base(db)
        {
        }

        public Task<Ip?> GetByValue(string value)
            => this.One(ip => ip.Value == value);
    }
}