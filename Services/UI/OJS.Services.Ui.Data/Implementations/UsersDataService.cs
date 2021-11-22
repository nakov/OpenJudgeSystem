namespace OJS.Services.Ui.Data.Implementations
{
    using OJS.Data.Models.Users;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Collections.Generic;
    using Microsoft.EntityFrameworkCore;
    using OJS.Services.Common.Data.Implementations;

    public class UsersDataService : DataService<UserProfile>, IUsersDataService
    {
        public UsersDataService(DbContext users) : base(users) {}

        public Task<UserProfile> GetByUsername(string username) =>
            this.DbSet.Where(u => u.UserName == username).FirstOrDefaultAsync();

        public Task<IEnumerable<UserProfile>> GetAllWithDeleted() =>
            base.All();

        public IQueryable<UserProfile> GetAllByRole(string roleId) =>
            this.DbSet
                .Where(x => x.Roles.Any(y => y.RoleId == roleId));
    }
}