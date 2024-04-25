namespace OJS.Services.Administration.Data.Implementations;

using OJS.Data;
using OJS.Data.Models.Common;
using OJS.Services.Common.Data.Implementations;

public class AdministrationDataService<TEntity> : DataService<TEntity>
    where TEntity : class, IEntity
{
    public AdministrationDataService(OjsDbContext db)
        : base(db)
        => this.IgnoreQueryFilters = true;
}