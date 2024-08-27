namespace OJS.Workers.Checkers
{
    using System;
    using System.IO;
    using System.Linq;
    using System.Reflection;
    using System.Text.RegularExpressions;
    using Microsoft.CodeAnalysis;
    using Microsoft.CodeAnalysis.CSharp;
    using Microsoft.CodeAnalysis.Emit;
    using Microsoft.CodeAnalysis.Text;
    using OJS.Workers.Checkers.CSharpCodeCheckers;
    using OJS.Workers.Common;

    public class CSharpCoreCodeChecker
        : CSharpCodeCheckerBase
    {
        protected override Type CompileCheckerAssembly(string sourceCode)
        {
            var codeString = SourceText.From(sourceCode);
            var options = CSharpParseOptions.Default.WithLanguageVersion(LanguageVersion.CSharp7_3);

            var parsedSyntaxTree = SyntaxFactory.ParseSyntaxTree(codeString, options);
            var systemDir = Path.GetDirectoryName(typeof(object).Assembly.Location)!;

            var references = new MetadataReference[]
            {
                MetadataReference.CreateFromFile(typeof(System.Runtime.AssemblyTargetedPatchBandAttribute)
                    .Assembly
                    .Location),
                MetadataReference.CreateFromFile(typeof(Microsoft.CSharp.RuntimeBinder.CSharpArgumentInfo)
                    .Assembly
                    .Location),
                MetadataReference.CreateFromFile(typeof(Regex).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(IChecker).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(object).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(Console).Assembly.Location),
                MetadataReference.CreateFromFile(Path.Combine(systemDir, "System.Collections.dll")),
                MetadataReference.CreateFromFile(Path.Combine(systemDir, "System.Runtime.dll")),
                MetadataReference.CreateFromFile(Path.Combine(systemDir, "netstandard.dll")),
            };

            using (var assemblyStream = new MemoryStream())
            {
                var result = CSharpCompilation.Create(
                       Guid.NewGuid().ToString(),
                       new[] { parsedSyntaxTree },
                       references: references,
                       options: new CSharpCompilationOptions(
                           OutputKind.DynamicallyLinkedLibrary,
                           optimizationLevel: OptimizationLevel.Release,
                           assemblyIdentityComparer: DesktopAssemblyIdentityComparer.Default));
                var compilationResult = result.Emit(assemblyStream);
                CheckForErrors(compilationResult);
                assemblyStream.Seek(0, SeekOrigin.Begin);
                var type = GetCustomCheckerType(Assembly.Load(assemblyStream.ToArray()));

                return type;
            }
        }

        private static void CheckForErrors(EmitResult result)
        {
            if (result.Success)
            {
                return;
            }

            var errors = result.Diagnostics.Where(x => x.Severity == DiagnosticSeverity.Error);
            var errorsString = string.Join(",", errors.Select(x => x.GetMessage(null)));

            // TODO: Introduce class CompilerException and throw exception of this type
            throw new InvalidOperationException(
                string.Format(
                    null,
                    "Could not compile checker!{0}Errors:{0}{1}",
                    Environment.NewLine,
                    errorsString));
        }
    }
}
