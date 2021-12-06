namespace OJS.Services.Ui.Business.Implementations
{
    using OJS.Services.Infrastructure.Constants;
    using OJS.Services.Ui.Models.Cache;
    using System.Threading.Tasks;
    using OJS.Services.Infrastructure.Cache;
    using OJS.Services.Ui.Data;
    using System.Collections.Generic;
    using System.Linq;

    public class CacheItemsProviderService : ICacheItemsProviderService
    {
        private readonly ICacheService cache;
        private readonly IContestCategoriesDataService contestCategoriesData;

        public CacheItemsProviderService(
            ICacheService cache,
            IContestCategoriesDataService contestCategoriesData)
        {
            this.cache = cache;
            this.contestCategoriesData = contestCategoriesData;
        }

        public IEnumerable<ContestCategoryListViewModel> GetContestSubCategoriesList(
            int? categoryId,
            int? cacheSeconds)
        {
            var cacheId = categoryId.HasValue
                ? string.Format(CacheConstants.ContestSubCategoriesFormat, categoryId.Value)
                : CacheConstants.ContestCategoriesTree;

            return this.cache.Get(cacheId, GetSubCategories, cacheSeconds);

            IEnumerable<ContestCategoryListViewModel> GetSubCategories() =>
                this.contestCategoriesData
                    .GetAllVisible()
                    .Where(cc => categoryId.HasValue ? cc.ParentId == categoryId : cc.ParentId == null)
                    .OrderBy(cc => cc.OrderBy)
                    .Select(ContestCategoryListViewModel.FromCategory)
                    .ToList();
        }

        public async Task<IEnumerable<ContestCategoryListViewModel>> GetContestCategoryParentsList(
            int categoryId,
            int? cacheSeconds = CacheConstants.OneDayInSeconds)
        {
            var cacheId = string.Format(CacheConstants.ContestParentCategoriesFormat, categoryId);

            var contestCategories = await this.cache.Get(cacheId, GetParentCategories, cacheSeconds);

            async Task<IEnumerable<ContestCategoryListViewModel>> GetParentCategories()
            {
                var categories = new List<ContestCategoryListViewModel>();
                var category = await this.contestCategoriesData.OneById(categoryId);

                while (category != null)
                {
                    categories.Add(new ContestCategoryListViewModel
                    {
                        Id = category.Id,
                        Name = category.Name
                    });

                    category = category.Parent;
                }

                categories.Reverse();

                return categories;
            }

            return contestCategories;
        }

        public IEnumerable<CategoryMenuItemViewModel> GetMainContestCategories(int? cacheSeconds) =>
            this.cache.Get(
                CacheConstants.MainContestCategoriesDropDown,
                () =>
                     this.contestCategoriesData
                        .GetAllVisible()
                        .Where(x => !x.ParentId.HasValue)
                        .OrderBy(x => x.OrderBy)
                        .Select(CategoryMenuItemViewModel.FromCategory)
                        .ToList(),
                cacheSeconds);


        public async Task<string> GetContestCategoryName(int categoryId, int? cacheSeconds) =>
            await this.cache.Get(
                string.Format(CacheConstants.ContestCategoryNameFormat, categoryId),
                () => this.contestCategoriesData.GetNameById(categoryId),
                cacheSeconds);

        public async Task ClearContestCategory(int categoryId)
        {
            var contestCategory = await this.contestCategoriesData.OneById(categoryId);

            if (contestCategory == null)
            {
                return;
            }

            contestCategory.Children
                .Select(cc => cc.Id)
                .ToList()
                .ForEach(RemoveCacheFromCategory);

            while (contestCategory != null)
            {
                RemoveCacheFromCategory(contestCategory.Id);

                contestCategory = contestCategory.Parent;
            }

            void RemoveCacheFromCategory(int contestCategoryId)
            {
                var categoryNameCacheId = string.Format(
                    CacheConstants.ContestCategoryNameFormat,
                    contestCategoryId);

                var subCategoriesCacheId = string.Format(
                    CacheConstants.ContestSubCategoriesFormat,
                    contestCategoryId);

                var parentCategoriesCacheId = string.Format(
                    CacheConstants.ContestParentCategoriesFormat,
                    contestCategoryId);

                this.cache.Remove(categoryNameCacheId);
                this.cache.Remove(subCategoriesCacheId);
                this.cache.Remove(parentCategoriesCacheId);
            }
        }
    }
}