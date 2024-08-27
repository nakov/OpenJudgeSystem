namespace OJS.Workers.Compilers
{
    using System.Text;
    using OJS.Workers.Common.Helpers;

    public class GolangCompiler : Compiler
    {
        public GolangCompiler(int processExitTimeOutMultiplier)
            : base(processExitTimeOutMultiplier)
        {
        }

        public override string BuildCompilerArguments(string inputFile, string outputFile, string additionalArguments)
        {
            var arguments = new StringBuilder();
            arguments.Append($"build ");
            arguments.Append(null, $"\"{inputFile}\" ");
            arguments.Append(additionalArguments);
            return arguments.ToString().Trim();
        }

        public override string GetOutputFileName(string inputFileName)
        {
            var inputFileNameWithoutExtension = inputFileName.Substring(0, inputFileName.LastIndexOf('.'));

            return OsPlatformHelpers.IsWindows()
                ? base.GetOutputFileName(inputFileNameWithoutExtension)
                : inputFileNameWithoutExtension;
        }
    }
}