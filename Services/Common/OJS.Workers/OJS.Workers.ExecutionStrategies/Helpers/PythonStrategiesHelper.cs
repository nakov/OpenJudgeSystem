namespace OJS.Workers.ExecutionStrategies.Helpers
{
    using OJS.Workers.Common.Helpers;

    using static OJS.Workers.Common.Constants;

    public static class PythonStrategiesHelper
    {
        private const string InitFileName = "__init__" + PythonFileExtension;

        public static void CreateFileInPackage(string filePath, string content)
        {
            var directoryPath = DirectoryHelpers.CreateDirectoryForFile(filePath);

            CreateInitFile(directoryPath);

            FileHelpers.WriteAllText(filePath, content);
        }

        private static void CreateInitFile(string directoryPath)
        {
            var filePath = FileHelpers.BuildPath(directoryPath, InitFileName);

            if (!FileHelpers.FileExists(filePath))
            {
                FileHelpers.WriteAllText(filePath, string.Empty);
            }
        }
    }
}