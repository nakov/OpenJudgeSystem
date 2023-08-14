using OJS.Services.Data.Settings;

namespace OJS.Web.Areas.Administration.Controllers
{
    using System.Collections;
    using System.Linq;
    using System.Web.Mvc;
    using Kendo.Mvc.UI;
    using OJS.Data;
    using OJS.Web.Areas.Administration.Controllers.Common;
    using DatabaseModelType = OJS.Data.Models.Setting;
    using ViewModelType = OJS.Web.Areas.Administration.ViewModels.Setting.SettingAdministrationViewModel;

    public class SettingsController : AdministrationBaseGridController
    {
        private readonly ISettingsService settingsService;

        public SettingsController(IOjsData data, ISettingsService settingsService)
            : base(data)
        {
            this.settingsService = settingsService;
        }

        public override IEnumerable GetData()
        {
            return this.Data.Settings
                .All()
                .Select(ViewModelType.ViewModel);
        }

        public override object GetById(object id)
        {
            return this.settingsService.Get(id.ToString(), typeof(string));
        }

        public override string GetEntityKeyName()
        {
            return this.GetEntityKeyNameByType(typeof(DatabaseModelType));
        }

        public ActionResult Index()
        {
            return this.View();
        }

        [HttpPost]
        public ActionResult Create([DataSourceRequest] DataSourceRequest request, ViewModelType model)
        {
            var id = this.BaseCreate(model.GetEntityModel());
            model.Name = (string)id;
            return this.GridOperation(request, model);
        }

        [HttpPost]
        public ActionResult Update([DataSourceRequest] DataSourceRequest request, ViewModelType model)
        {
            var entity = this.GetById(model.Name) as DatabaseModelType;
            this.BaseUpdate(model.GetEntityModel(entity));
            return this.GridOperation(request, model);
        }

        [HttpPost]
        public ActionResult Destroy([DataSourceRequest] DataSourceRequest request, ViewModelType model)
        {
            this.BaseDestroy(model.Name);
            return this.GridOperation(request, model);
        }
    }
}