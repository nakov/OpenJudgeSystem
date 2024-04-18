namespace OJS.Data.Models.Users;

using Microsoft.AspNetCore.Identity;
using OJS.Data.Models.Common;
using System.Collections.Generic;

public class Role : IdentityRole, IEntity<string>
{
    public Role()
        : base()
    {
    }

    public Role(string name)
        : base(name)
    {
    }

    public virtual ICollection<UserInRole> UsersInRoles { get; set; }
        = new HashSet<UserInRole>();
}