namespace OJS.Services.Administration.Data.Implementations
{
    using OJS.Data;
    using OJS.Data.Models.Users;

    public class UsersDataService : AdministrationDataService<UserProfile>, IUsersDataService
    {
        public UsersDataService(OjsDbContext users)
            : base(users)
        {
        }
    }
}