#nullable disable
namespace OJS.Workers.Compilers
{
    using System.IO;
    using System.Text;

    using OJS.Workers.Common;
    using OJS.Workers.Common.Helpers;

    public class DotNetCompiler : Compiler
    {
        public DotNetCompiler(int processExitTimeOutMultiplier)
            : base(processExitTimeOutMultiplier)
        {
        }

        public override bool ShouldDeleteSourceFile => false;

        public override string ChangeOutputFileAfterCompilation(string outputFile)
        {
            string compiledFileName = Path.GetFileNameWithoutExtension(Path.GetFileNameWithoutExtension(outputFile));
            string rootDir = Path.GetDirectoryName(outputFile);
            string compiledFile =
                FileHelpers.FindFileMatchingPattern(
                    rootDir,
                    $"{compiledFileName}{Constants.ClassLibraryFileExtension}");

            return compiledFile;
        }

        public override string BuildCompilerArguments(string inputFile, string outputFile, string additionalArguments)
        {
            var inputFileDirectory = Path.GetDirectoryName(inputFile)
                ?? throw new DirectoryNotFoundException($"Input file directory not found. Input file path value: {inputFile}");

            var compilingDir = FileHelpers.BuildPath(inputFileDirectory, CompilationDirectoryName);
            Directory.CreateDirectory(compilingDir);

            var arguments = new StringBuilder();
            arguments.Append("build ");
            arguments.Append($"-o {compilingDir} ");
            arguments.Append($"\"{inputFile}\" ");
            arguments.Append(additionalArguments);
            return arguments.ToString().Trim();
        }
    }
}