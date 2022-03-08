namespace OJS.Servers.Administration.Infrastructure.Extensions
{
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
    using static AutoCrudAdmin.Constants.TempDataKeys;

    public static class TempDataExtensions
    {
        public static void AddSuccessMessage(this ITempDataDictionary tempData, string? message)
            => tempData.Add(SuccessMessage, message ?? "Success!");

        public static void AddDangerMessage(this ITempDataDictionary tempData, string? message)
            => tempData.Add(DangerMessage, message ?? "An unexpected error has occured.");
    }
}