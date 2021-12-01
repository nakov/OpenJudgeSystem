namespace OJS.Servers.Administration.Controllers
{
    using AutoCrudAdmin.Controllers;
    using AutoCrudAdmin.ViewModels;
    using OJS.Data.Models.Contests;
    using OJS.Servers.Infrastructure.Extensions;
    using OJS.Services.Administration.Data;
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using AdminResource = OJS.Common.Resources.AdministrationGeneral;

    public class ContestsController : AutoCrudAdminController<Contest>
    {
        private readonly IContestCategoriesDataService contestCategoriesData;

        public ContestsController(IContestCategoriesDataService contestCategoriesData)
            => this.contestCategoriesData = contestCategoriesData;

        protected override IEnumerable<Func<Contest, Task<ValidatorResult>>> AsyncEntityValidators
            => new Func<Contest, Task<ValidatorResult>>[]
            {
                this.ValidateContestCategoryPermissions,
            };

        private async Task<ValidatorResult> ValidateContestCategoryPermissions(Contest contest)
        {
            var userId = this.User.GetId();
            var userIsAdmin = this.User.IsAdmin();

            if (contest.CategoryId.HasValue &&
                await this.contestCategoriesData.UserHasContestCategoryPermissions(
                    contest.CategoryId.Value,
                    userId,
                    userIsAdmin))
            {
                return ValidatorResult.Success();
            }

            return ValidatorResult.Error(AdminResource.No_privileges_message);
        }
    }
}