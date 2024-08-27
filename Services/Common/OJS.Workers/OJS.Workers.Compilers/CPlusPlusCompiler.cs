namespace OJS.Workers.Compilers
{
    using System.Text;

    public class CPlusPlusCompiler : Compiler
    {
        public CPlusPlusCompiler(int processExitTimeOutMultiplier)
            : base(processExitTimeOutMultiplier)
        {
        }

        public override string RenameInputFile(string inputFile) =>
            // Add "cpp" extension so the compiler will treat the file as C++ code file
            inputFile + ".cpp";

        public override string BuildCompilerArguments(string inputFile, string outputFile, string additionalArguments)
        {
            var arguments = new StringBuilder();

            // Input file argument
            arguments.Append(null, $"\"{inputFile}\"");
            arguments.Append(' ');

            // Output file argument
            arguments.Append(null, $"-o \"{outputFile}\"");
            arguments.Append(' ');

            // Additional compiler arguments
            arguments.Append(additionalArguments);

            return arguments.ToString().Trim();
        }
    }
}
