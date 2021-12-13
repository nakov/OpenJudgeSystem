namespace OJS.Servers.Infrastructure.Extensions
{
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
    using OJS.Common;

    public static class TempDataExtensions
    {
        public static void AddDangerMessage(this ITempDataDictionary tempData, string message)
            => tempData.Add(GlobalConstants.DangerMessage, message);

        public static void AddInfoMessage(this ITempDataDictionary tempData, string message)
            => tempData.Add(GlobalConstants.InfoMessage, message);
    }
}