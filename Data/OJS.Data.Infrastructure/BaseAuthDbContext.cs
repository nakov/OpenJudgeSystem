namespace OJS.Data.Infrastructure;

using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public class BaseAuthDbContext<TDbContext, TUser>
    : BaseIdentityDbContext<
        TDbContext,
        TUser,
        IdentityRole,
        string,
        IdentityUserClaim<string>,
        IdentityUserRole<string>,
        IdentityUserLogin<string>,
        IdentityRoleClaim<string>,
        IdentityUserToken<string>>
    where TDbContext : DbContext
    where TUser : IdentityUser
{
    // This constructor is needed for migration creation during design time.
    public BaseAuthDbContext()
    {
    }

    public BaseAuthDbContext(DbContextOptions<TDbContext> options)
        : base(options)
    {
    }
}

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
    // This constructor is needed for migration creation during design time.
    public BaseAuthDbContext()
    {
    }

    public BaseAuthDbContext(
        DbContextOptions<TDbContext> options)
        : base(options)
    {
    }
}