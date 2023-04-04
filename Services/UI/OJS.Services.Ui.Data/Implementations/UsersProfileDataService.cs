namespace OJS.Services.Ui.Data.Implementations
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.EntityFrameworkCore;
    using OJS.Data;
    using OJS.Data.Models.Users;
    using OJS.Services.Common.Data.Implementations;
    using SoftUni.AutoMapper.Infrastructure.Extensions;

    public class UsersProfileDataService : DataService<UserProfile>, IUsersProfileDataService
    {
        public UsersProfileDataService(OjsDbContext db)
            : base(db)
        {
        }

        public IQueryable<UserProfile> GetAll()
            => this.DbSet
                .Where(u => !u.IsDeleted);

        public Task<TServiceModel?> GetByUsername<TServiceModel>(string? username)
            => this.DbSet
                .Include(up => up.UserSettings)
                .Where(u => u.UserName == username)
                .MapCollection<TServiceModel>()
                .FirstOrDefaultAsync();
    }
}