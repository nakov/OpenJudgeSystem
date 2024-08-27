namespace OJS.Services.Ui.Data.Implementations
{
    using Microsoft.EntityFrameworkCore;
    using OJS.Data;
    using OJS.Data.Models.Users;
    using OJS.Services.Common.Data.Implementations;
    using OJS.Services.Infrastructure.Extensions;
    using System.Linq;
    using System.Threading.Tasks;

    public class UsersProfileDataService : DataService<UserProfile>, IUsersProfileDataService
    {
        public UsersProfileDataService(OjsDbContext db)
            : base(db)
        {
        }

        public IQueryable<UserProfile> GetAll()
            => this.GetQuery(u => !u.IsDeleted);

        public async Task<TServiceModel> AddOrUpdate<TServiceModel>(UserProfile userProfile)
        {
            var existingUser = await this
                .GetByUsername(userProfile.UserName)
                .FirstOrDefaultAsync();

            if (existingUser == null)
            {
                existingUser = userProfile;
                await this.Add(existingUser);
            }
            else
            {
                existingUser.PasswordHash = userProfile.PasswordHash;
                existingUser.SecurityStamp = userProfile.SecurityStamp;
                existingUser.Email = userProfile.Email;
                existingUser.IsDeleted = userProfile.IsDeleted;
                existingUser.DeletedOn = userProfile.DeletedOn;
                existingUser.ModifiedOn = userProfile.ModifiedOn;
                existingUser.UserSettings = userProfile.UserSettings;

                this.Update(existingUser);
            }

            await this.SaveChanges();

            return existingUser.Map<TServiceModel>();
        }

        public Task<TServiceModel?> GetByUsername<TServiceModel>(string? username)
            => this.GetByUsername(username)
                .FirstOrDefaultAsync()
                .Map<TServiceModel?>();

        public IQueryable<UserProfile> GetByUsername(string? username)
            => this.GetQuery(u => u.UserName == username)
                .Include(up => up.UserSettings);
    }
}