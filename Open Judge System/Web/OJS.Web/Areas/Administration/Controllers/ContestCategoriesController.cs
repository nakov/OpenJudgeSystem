﻿namespace OJS.Web.Areas.Administration.Controllers
{
    using System;
    using System.Collections;
    using System.Linq;
    using System.Web;
    using System.Web.Mvc;
    using Kendo.Mvc.Extensions;
    using Kendo.Mvc.UI;
    using OJS.Common;
    using OJS.Common.Extensions;
    using OJS.Data;
    using OJS.Services.Business.ContestCategories;
    using OJS.Services.Common.BackgroundJobs;
    using OJS.Services.Common.HttpRequester;
    using OJS.Web.Areas.Administration.Controllers.Common;
    using OJS.Web.Areas.Administration.ViewModels.ContestCategory;
    using OJS.Web.Common.Extensions;
    using OJS.Web.Infrastructure.Filters.Attributes;

    using DatabaseModelType = OJS.Data.Models.ContestCategory;
    using ViewModelType = OJS.Web.Areas.Administration.ViewModels.ContestCategory.ContestCategoryAdministrationViewModel;

    public class ContestCategoriesController : AdministrationBaseGridController
    {
        private readonly IHangfireBackgroundJobService backgroundJobs;
        private readonly IHttpRequesterService httpRequester;

        public ContestCategoriesController(
            IOjsData data,
            IHangfireBackgroundJobService backgroundJobs,
            IHttpRequesterService httpRequester)
            : base(data)
        {
            this.backgroundJobs = backgroundJobs;
            this.httpRequester = httpRequester;
        }

        public override IEnumerable GetData()
        {
            return this.Data.ContestCategories
                .All()
                .Where(cat => !cat.IsDeleted)
                .Select(ViewModelType.ViewModel);
        }

        public override object GetById(object id)
        {
            return this.Data.ContestCategories
                .All()
                .FirstOrDefault(o => o.Id == (int)id);
        }

        public override string GetEntityKeyName() =>
            this.GetEntityKeyNameByType(typeof(DatabaseModelType));

        public ActionResult Index() => this.View();

        [HttpPost]
        [ClearMainContestCategoriesCache]
        [ClearContestCategoryCache(queryKeyForCategoryId: nameof(ViewModelType.Id))]
        public ActionResult Create([DataSourceRequest]DataSourceRequest request, ViewModelType model)
        {
            var databaseModel = model.GetEntityModel();
            model.Id = (int)this.BaseCreate(databaseModel);
            this.UpdateAuditInfoValues(model, databaseModel);
            return this.GridOperation(request, model);
        }

        [HttpPost]
        [ClearMainContestCategoriesCache]
        [ClearContestCategoryCache(queryKeyForCategoryId: nameof(ViewModelType.Id))]
        public ActionResult Update([DataSourceRequest]DataSourceRequest request, ViewModelType model)
        {
            var entity = this.GetById(model.Id) as DatabaseModelType;
            this.BaseUpdate(model.GetEntityModel(entity));
            this.UpdateAuditInfoValues(model, entity);
            return this.GridOperation(request, model);
        }

        [HttpPost]
        [ClearMainContestCategoriesCache]
        [ClearContestCategoryCache(queryKeyForCategoryId: nameof(ViewModelType.Id))]
        public ActionResult Destroy([DataSourceRequest]DataSourceRequest request, ViewModelType model)
        {
            var contest = this.Data.ContestCategories.GetById(model.Id.Value);
            this.CascadeDeleteCategories(contest);
            return this.Json(this.ModelState.ToDataSourceResult());
        }

        public ActionResult Hierarchy() => this.View();

        public ActionResult ReadCategories(int? id)
        {
            var categories =
                this.Data.ContestCategories.All()
                    .Where(x => x.IsVisible)
                    .Where(x => id.HasValue ? x.ParentId == id : x.ParentId == null)
                    .OrderBy(x => x.OrderBy)
                    .Select(x => new { id = x.Id, hasChildren = x.Children.Any(), x.Name, });

            return this.Json(categories, JsonRequestBehavior.AllowGet);
        }

        [ClearMainContestCategoriesCache]
        [ClearMovedContestCategoryCache("id", "to")]
        public void MoveCategory(int id, int? to)
        {
            if (id != to)
            {
                var category = this.Data.ContestCategories.GetById(id);
                category.ParentId = to;
                this.Data.SaveChanges();
            }
        }

        [HttpGet]
        [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
        public ActionResult ImportContests(int categoryId)
        {
            var category = this.Data.ContestCategories.GetById(categoryId) ?? throw new HttpException(404, "Category not found");

            var model = new ImportContestsViewModel
            {
                CategoryId = category.Id,
                CategoryName = category.Name,
            };

            this.ViewBag.ReturnUrl = $"/Contests/#!/List/ByCategory/{model.CategoryId}/{model.CategoryName.ToUrl()}";
            return this.View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Authorize(Roles = GlobalConstants.AdministratorRoleName)]
        public ActionResult ImportContests(ImportContestsViewModel model, string returnUrl)
        {
            this.ViewBag.ReturnUrl = returnUrl;

            if (!this.ModelState.IsValid)
            {
                return this.View(model);
            }

            var category = this.Data.ContestCategories.GetById(model.CategoryId) ?? throw new HttpException(404, "Category not found");

            var contestIdsToImport = model.ContestIdsToImport
                .Split(new[] { '\r', '\n', ' ', ',' }, StringSplitOptions.RemoveEmptyEntries)
                .Select(int.Parse)
                .Distinct()
                .ToArray();

            var existingContestIds = this.httpRequester.Get<int[]>(
                new { ids = contestIdsToImport },
                $"{model.OjsPlatformUrl.TrimEnd('/')}/api/Contests/GetExistingIds",
                model.UserApiKey);

            if (!existingContestIds.IsSuccess)
            {
                if (existingContestIds.ErrorMessage.Contains("Invalid API key"))
                {
                    this.ModelState.AddModelError(nameof(model.UserApiKey), "Invalid user API key.");
                }
                else
                {
                    this.ModelState.AddModelError(nameof(model.OjsPlatformUrl), existingContestIds.ErrorMessage);
                }

                return this.View(model);
            }

            if (existingContestIds.Data.Length != contestIdsToImport.Length)
            {
                var invalidIds = contestIdsToImport.Except(existingContestIds.Data).ToArray();
                this.ModelState.AddModelError(
                    nameof(model.ContestIdsToImport),
                    $"Some contests do not exist in the provided OJS platform. The following IDs are invalid: {string.Join(", ", invalidIds)}");
                return this.View(model);
            }

            this.backgroundJobs.AddFireAndForgetJob<IContestCategoriesImportService>(
                x => x.ImportContestsIntoCategory(
                    category.Id,
                    model.OjsPlatformUrl,
                    model.ReplaceExistingContests,
                    contestIdsToImport));

            this.TempData.AddInfoMessage(
                $"Contests are being imported into {category.Name}. This may take a while. " +
                "You can continue working in the meantime and check the results later.");

            return this.Redirect(returnUrl);
        }

        private void CascadeDeleteCategories(DatabaseModelType contest)
        {
            foreach (var children in contest.Children.ToList())
            {
                this.CascadeDeleteCategories(children);
            }

            this.Data.ContestCategories.Delete(contest);
            this.Data.SaveChanges();
        }
    }
}