namespace OJS.Data.Models.Users;

using Microsoft.AspNetCore.Identity;
using OJS.Data.Models.Common;

public class UserInRole : IdentityUserRole<string>, IEntity
{
    public virtual UserProfile User { get; set; } = null!;

    public virtual Role Role { get; set; } = null!;
}