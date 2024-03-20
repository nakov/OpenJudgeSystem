namespace OJS.Services.Administration.Data.Implementations;

using Microsoft.EntityFrameworkCore;
using OJS.Data.Models.Users;
using OJS.Services.Common.Data.Implementations;

public class RoleDataService : DataService<Role>, IRoleDataService
{
    public RoleDataService(DbContext db)
        : base(db)
    {
    }
}