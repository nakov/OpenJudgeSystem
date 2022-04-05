namespace OJS.Data.Models.Users;

using Microsoft.AspNetCore.Identity;

public class UserInRole : IdentityUserRole<string>
{
    public virtual UserProfile User { get; set; } = null!;

    public virtual Role Role { get; set; } = null!;
}