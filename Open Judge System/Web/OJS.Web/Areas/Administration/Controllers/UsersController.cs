namespace OJS.Web.Areas.Administration.Controllers
{
    using System.Collections;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Linq;
    using System.Web.Mvc;

    using Kendo.Mvc.Extensions;
    using Kendo.Mvc.UI;
    using Newtonsoft.Json;
    using OJS.Data;
    using OJS.Web.Areas.Administration.Controllers.Common;

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

        [HttpPost]
        public ActionResult Deactivate([DataSourceRequest] DataSourceRequest request, ViewModelType model)
        {
            var list = new List<ViewModelType>();

            if (model != null && this.ModelState.IsValid)
            {
                var userProfile = this.Data.Users.All().FirstOrDefault(u => u.Id == model.Id);
                var userProfileJson = JsonConvert.SerializeObject(userProfile);
                this.Data.Users.Delete(userProfile);
                this.Data.AccessLogs.Add(new Data.Models.AccessLog
                {
                    UserId = this.UserProfile.Id,
                    RequestType = "Deactivate User",
                    IpAddress = this.Request.UserHostAddress,
                    PostParams = $"Deactivated user: {userProfileJson}",
                });
                this.Data.SaveChanges();
                list.Add(model);
            }

            return this.Json(list.ToDataSourceResult(request));
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