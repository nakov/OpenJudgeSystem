namespace OJS.Web.Infrastructure.Seeders
{
    using System.Linq;
    using Microsoft.AspNet.Identity;
    using OJS.Common;
    using OJS.Data.Models;

    public class AdministratorSeeder : ISeeder
    {
        private readonly UserManager<UserProfile> userManager;
        private readonly string password;

        public AdministratorSeeder(UserManager<UserProfile> userManager, string password)
        {
            this.userManager = userManager;
            this.password = password;
        }

        public void SeedData()
        {
            if (this.userManager.Users.Any(x => x.UserName == GlobalConstants.AdministratorUserName))
            {
                return;
            }

            var user = new UserProfile
            {
                Email = GlobalConstants.AdministratorEmail,
                UserName = GlobalConstants.AdministratorUserName
            };

            var result = this.userManager.Create(user, this.password);

            if (result.Succeeded)
            {
                this.userManager.AddToRoleAsync(user.Id, GlobalConstants.AdministratorRoleName);
            }
        }
    }
}