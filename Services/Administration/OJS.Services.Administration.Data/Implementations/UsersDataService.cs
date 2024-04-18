namespace OJS.Services.Administration.Data.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Data;
    using OJS.Data.Models.Users;
    using OJS.Services.Common.Data.Implementations;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class UsersDataService : DataService<UserProfile>, IUsersDataService
    {
        public UsersDataService(OjsDbContext users)
            : base(users)
        {
        }

        public Task<UserProfile?> GetByUsername(string username) =>
            this.GetQuery(u => u.UserName == username).FirstOrDefaultAsync();

        public Task<IEnumerable<UserProfile>> GetAllWithDeleted() =>
            this.All();

        // public IQueryable<UserProfile> GetAllByRole(string roleId) =>
        //     this.DbSet
        //         .Where(x => x.Roles.Any(y => y.RoleId == roleId));
    }
}