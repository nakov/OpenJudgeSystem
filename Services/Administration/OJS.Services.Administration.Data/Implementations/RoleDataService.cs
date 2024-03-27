namespace OJS.Services.Administration.Data.Implementations;

using OJS.Data;
using OJS.Data.Models.Users;
using OJS.Services.Common.Data.Implementations;

public class RoleDataService : DataService<Role>, IRoleDataService
{
    public RoleDataService(OjsDbContext db)
        : base(db)
    {
    }
}