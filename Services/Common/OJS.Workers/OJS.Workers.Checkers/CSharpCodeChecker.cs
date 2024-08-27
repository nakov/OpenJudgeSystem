namespace OJS.Workers.Checkers
{
    using System;
    using System.Reflection;
    using System.Text;
    using System.Text.RegularExpressions;
    using Microsoft.CodeAnalysis;
    using Microsoft.CodeAnalysis.CSharp;
    using OJS.Workers.Checkers.CSharpCodeCheckers;
    using static OJS.Workers.Checkers.CheckerConstants.TypeNames;

    public class CSharpCodeChecker
        : CSharpCodeCheckerBase
    {
        protected override Type CompileCheckerAssembly(string sourceCode)
        {
            var syntaxTree = CSharpSyntaxTree.ParseText(sourceCode);
            var assemblyPath = Path.GetDirectoryName(typeof(object).Assembly.Location)!;

            var references = new List<MetadataReference>
            {
                MetadataReference.CreateFromFile(typeof(object).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(Enumerable).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(Regex).Assembly.Location),
                MetadataReference.CreateFromFile(Path.Combine(assemblyPath, "System.Runtime.dll")),
                MetadataReference.CreateFromFile(typeof(Common.CheckerDetails).Assembly.Location),
            };

            var compilation = CSharpCompilation.Create(
                "CheckerAssembly",
                new[] { syntaxTree },
                references,
                new CSharpCompilationOptions(OutputKind.DynamicallyLinkedLibrary));

            using var ms = new MemoryStream();
            var result = compilation.Emit(ms);

            if (!result.Success)
            {
                var errorsStringBuilder = new StringBuilder();

                errorsStringBuilder.AppendLine(CompilationErrorMessage);

                var failures = result.Diagnostics.Where(diagnostic =>
                    diagnostic.IsWarningAsError ||
                    diagnostic.Severity == DiagnosticSeverity.Error);

                foreach (var diagnostic in failures)
                {
                    errorsStringBuilder.AppendLine(null, $"{diagnostic.Id}: {diagnostic.GetMessage(null)}");
                }

                throw new InvalidOperationException(
                    $"Could not compile checker!{Environment.NewLine}Errors:{Environment.NewLine}{errorsStringBuilder}");
            }

            ms.Seek(0, SeekOrigin.Begin);
            var assembly = Assembly.Load(ms.ToArray());
            return GetCustomCheckerType(assembly);
        }
    }
}