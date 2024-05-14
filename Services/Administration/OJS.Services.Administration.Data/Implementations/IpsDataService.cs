namespace OJS.Services.Administration.Data.Implementations
{
    using FluentExtensions.Extensions;
    using OJS.Data;
    using OJS.Data.Models;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    public class IpsDataService : AdministrationDataService<Ip>, IIpsDataService
    {
        public IpsDataService(OjsDbContext db)
            : base(db)
        {
        }

        public Task<Ip?> GetByValue(string value)
            => this.One(ip => ip.Value == value);

        public async Task DeleteIps(IEnumerable<IpInContest> ips)
        {
            ips.ForEach(ip =>
            {
                this.Delete(ip.Ip);
            });

            await this.SaveChanges();
        }
    }
}