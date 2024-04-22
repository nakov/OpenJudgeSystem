namespace OJS.Data;

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public class BaseAuthDbContext<TDbContext, TUser, TRole, TUserRole>
    : BaseIdentityDbContext<
        TDbContext,
        TUser,
        TRole,
        string,
        IdentityUserClaim<string>,
        TUserRole,
        IdentityUserLogin<string>,
        IdentityRoleClaim<string>,
        IdentityUserToken<string>>
    where TDbContext : DbContext
    where TUser : IdentityUser
    where TRole : IdentityRole
    where TUserRole : IdentityUserRole<string>
{
    public BaseAuthDbContext(
        DbContextOptions<TDbContext> options)
        : base(options)
    {
    }
}