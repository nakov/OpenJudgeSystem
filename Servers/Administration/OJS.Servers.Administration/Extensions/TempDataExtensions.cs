namespace OJS.Servers.Administration.Extensions;

using Microsoft.AspNetCore.Mvc.ViewFeatures;
using static AutoCrudAdmin.Constants.TempDataKeys;

internal static class TempDataExtensions
{
    public static void AddSuccessMessage(this ITempDataDictionary tempData, string? message)
        => tempData.Add(SuccessMessage, message ?? "Success!");

    public static void AddDangerMessage(this ITempDataDictionary tempData, string? message)
        => tempData.Add(DangerMessage, message ?? "An unexpected error has occured.");
}
