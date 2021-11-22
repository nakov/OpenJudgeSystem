namespace OJS.Services.Ui.Data.Implementations
{
    using OJS.Data.Models.Users;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.EntityFrameworkCore;
    using OJS.Services.Common.Data.Implementations;

    public class UsersDataService : DataService<UserProfile>, IUsersDataService
    {
        public UsersDataService(DbContext users) : base(users) {}

        public Task<UserProfile> GetByUsername(string username)
            => this.DbSet
                .Where(u => u.UserName == username)
                .FirstOrDefaultAsync();
    }
}