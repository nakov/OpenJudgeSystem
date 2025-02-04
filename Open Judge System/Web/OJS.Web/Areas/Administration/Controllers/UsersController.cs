namespace OJS.Web.Areas.Administration.Controllers
{
    using System.Collections;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Linq;
    using System.Web.Mvc;

    using Kendo.Mvc.Extensions;
    using Kendo.Mvc.UI;

    using OJS.Data;
    using OJS.Web.Areas.Administration.Controllers.Common;
    using OJS.Web.Areas.Administration.ViewModels.User;
    using OJS.Web.Common.Extensions;

    using ViewModelType = OJS.Web.Areas.Administration.ViewModels.User.UserProfileAdministrationViewModel;

    public class UsersController : AdministrationBaseGridController
    {
        public UsersController(IOjsData data)
            : base(data)
        {
        }

        public override IEnumerable GetData()
        {
            return this.Data.Users
                .All()
                .Select(ViewModelType.ViewModel);
        }

        public override object GetById(object id)
        {
            return this.Data.Users
                .All()
                .FirstOrDefault(o => o.Id == (string)id);
        }

        public ActionResult Index()
        {
            return this.View();
        }

        [HttpGet]
        public ActionResult Delete(string id)
        {
            var user = this.Data.Users.All().Where(u => u.Id == id).Select(UserProfileDeleteViewModel.FromUserProfile).FirstOrDefault();

            if (user == null)
            {
                this.TempData.AddDangerMessage("User not found.");
                return this.RedirectToAction(nameof(this.Index));
            }

            return this.View(user);
        }

        [HttpPost]
        public ActionResult Delete(UserProfileDeleteViewModel model)
        {
            if (model.InitiatorUsername != this.UserProfile.UserName)
            {
                this.ModelState.AddModelError(nameof(model.InitiatorUsername), "You must enter your username.");
                return this.View(model);
            }

            var userProfile = this.Data.Users.All().FirstOrDefault(u => u.Id == model.Id);

            if (userProfile != null)
            {
                // Store user info in variables for temp message, because after Delete, they are modified.
                var username = userProfile.UserName;
                var email = userProfile.Email;

                this.Data.Users.Delete(userProfile);
                this.Data.AccessLogs.Add(new Data.Models.AccessLog
                {
                    UserId = this.UserProfile.Id,
                    IpAddress = this.Request.UserHostAddress,
                    RequestType = "DELETE",
                    PostParams = $"Deleted user with Id {userProfile.Id}. New username is: {userProfile.UserName} and email is: {userProfile.Email}",
                });

                this.Data.SaveChanges();

                this.TempData.AddWarningMessage($"User {username} with email {email} deleted successfully. If this was a mistake, contact support immediately.");
            }

            return this.RedirectToAction(nameof(this.Index));
        }

        [HttpPost]
        public ActionResult Update([DataSourceRequest]DataSourceRequest request, ViewModelType model)
        {
            var list = new List<ViewModelType>();

            if (model != null && this.ModelState.IsValid)
            {
                var userProfile = this.Data.Users.All().FirstOrDefault(u => u.Id == model.Id);
                var itemForUpdating = this.Data.Context.Entry(model.GetEntityModel(userProfile));
                itemForUpdating.State = EntityState.Modified;
                this.Data.SaveChanges();
                list.Add(model);
            }

            return this.Json(list.ToDataSourceResult(request));
        }
    }
}