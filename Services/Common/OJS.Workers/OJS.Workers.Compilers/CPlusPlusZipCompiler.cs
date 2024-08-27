namespace OJS.Workers.Compilers
{
    using System;
    using System.IO;
    using System.Linq;
    using System.Text;

    using OJS.Workers.Common;
    using OJS.Workers.Common.Helpers;

    public class CPlusPlusZipCompiler : Compiler
    {
        private const string CPlusPlusClassFileExtension = ".cpp";
        private const string CClassFileExtension = ".c";

        public CPlusPlusZipCompiler(int processExitTimeOutMultiplier)
            : base(processExitTimeOutMultiplier)
        {
        }

        public override string RenameInputFile(string inputFile)
        {
            if (inputFile.EndsWith(Constants.ZipFileExtension, StringComparison.InvariantCultureIgnoreCase))
            {
                return inputFile;
            }

            return $"{inputFile}{Constants.ZipFileExtension}";
        }

        public override string BuildCompilerArguments(string inputFile, string outputFile, string additionalArguments)
        {
            var arguments = new StringBuilder();

            arguments.Append(null, $"-o \"{outputFile}\"");
            arguments.Append(' ');

            arguments.Append(additionalArguments);
            arguments.Append(' ');
            FileHelpers.UnzipFile(inputFile, this.CompilationDirectory);

            var filesToCompile = Directory
                .EnumerateFiles(
                    this.CompilationDirectory,
                    "*.*",
                    SearchOption.AllDirectories)
                .Where(f =>
                    f.EndsWith(CClassFileExtension, StringComparison.InvariantCultureIgnoreCase) ||
                    f.EndsWith(CPlusPlusClassFileExtension, StringComparison.InvariantCultureIgnoreCase));

            foreach (var file in filesToCompile)
            {
                arguments.Append(null, $"\"{file}\"");
                arguments.Append(' ');
            }

            return arguments.ToString();
        }

        public override string GetOutputFileName(string inputFileName)
        {
            inputFileName = inputFileName.Replace(".zip", ".exe");
            return inputFileName;
        }
    }
}