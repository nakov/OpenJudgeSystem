namespace OJS.Services.Business.ContestCategories
{
    using OJS.Services.Common;

    public interface IContestCategoriesImportService : IService
    {
        /// <summary>
        /// Imports contests into a category from a given OJS platform.
        /// </summary>
        /// <param name="categoryId">The id of the category to import the contests into.</param>
        /// <param name="ojsPlatformUrl">The url of the OJS platform to import the contests from.</param>
        /// <param name="replace">If true, it will replace the data in the matching existing contests in the category.</param>
        /// <param name="contestIds">The ids of the contests to import from the provided ojs platform.</param>
        /// <returns>Message with the result of the import.</returns>
        string ImportContestsIntoCategory(int categoryId, string ojsPlatformUrl, bool replace, params int[] contestIds);
    }
}