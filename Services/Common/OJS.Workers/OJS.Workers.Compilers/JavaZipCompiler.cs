#nullable disable
namespace OJS.Workers.Compilers
{
    using System;
    using System.IO;
    using System.Linq;
    using System.Text;

    using OJS.Workers.Common.Helpers;

    public class JavaZipCompiler : Compiler
    {
        private const string JavaCompiledFilesSearchPattern = "*.class";
        private const string JavaSourceFilesSearchPattern = "*.java";
        private const string MainClassFileName = "Main.class";
        private static readonly string MainClassFilePathSuffix = FileHelpers.BuildPath(string.Empty, MainClassFileName);

        public JavaZipCompiler(int processExitTimeOutMultiplier)
            : base(processExitTimeOutMultiplier)
        {
        }

        public override bool ShouldDeleteSourceFile => false;

        public override string GetOutputFileName(string inputFileName) => new FileInfo(inputFileName).DirectoryName;

#pragma warning disable CA1725
        public override string BuildCompilerArguments(string inputFile, string outputDirectory, string additionalArguments)
#pragma warning restore CA1725
        {
            var arguments = new StringBuilder();

            // Output path argument
            arguments.Append(null, $"-d \"{outputDirectory}\" ");

            // Additional compiler arguments
            arguments.Append(additionalArguments);
            arguments.Append(' ');

            FileHelpers.UnzipFile(inputFile, this.CompilationDirectory);

            // Input files arguments
            var filesToCompile =
                Directory.GetFiles(this.CompilationDirectory, JavaSourceFilesSearchPattern, SearchOption.AllDirectories);
            for (var i = 0; i < filesToCompile.Length; i++)
            {
                arguments.Append(null, $"\"{filesToCompile[i]}\"");
                arguments.Append(' ');
            }

            return arguments.ToString();
        }

#pragma warning disable CA1725
        public override string ChangeOutputFileAfterCompilation(string outputDirectory)
#pragma warning restore CA1725
        {
            var compiledFiles =
                Directory.EnumerateFiles(outputDirectory, JavaCompiledFilesSearchPattern, SearchOption.AllDirectories);

            // TODO: Find the main class after analyzing which source file contains the main method
            var mainClassFile = compiledFiles
                .FirstOrDefault(file => file.EndsWith(MainClassFilePathSuffix, StringComparison.InvariantCultureIgnoreCase));

            if (string.IsNullOrWhiteSpace(mainClassFile))
            {
                throw new ArgumentException($"'{MainClassFileName}' file not found in output directory.", nameof(outputDirectory));
            }

            return mainClassFile;
        }
    }
}