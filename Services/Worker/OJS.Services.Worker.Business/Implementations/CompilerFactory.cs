namespace OJS.Services.Worker.Business.Implementations;

using Microsoft.Extensions.Options;
using OJS.Services.Worker.Models.Configuration;
using OJS.Workers.Common;
using OJS.Workers.Common.Models;
using OJS.Workers.Compilers;
using System;

public class CompilerFactory : ICompilerFactory
{
    private readonly OjsWorkersConfig settings;

    public CompilerFactory(IOptions<OjsWorkersConfig> settingsAccessor)
        => this.settings = settingsAccessor.Value;

    public string GetCompilerPath(CompilerType compilerType, ExecutionStrategyType strategyType)
    {
        switch (compilerType)
        {
            case CompilerType.CPlusPlusGcc:
            case CompilerType.CPlusPlusZip:
                return this.settings.CPlusPlusGccCompilerPath;
            case CompilerType.Java:
            case CompilerType.JavaZip:
            case CompilerType.JavaInPlaceCompiler:
                return this.settings.JavaCompilerPath;
            case CompilerType.DotNetCompiler:
            case CompilerType.CSharpDotNetCore:
                return this.settings.DotNetCompilerPath;
            case CompilerType.GolangCompiler:
                return this.settings.GolangCompilerPath;
            case CompilerType.None:
            default:
                throw new ArgumentOutOfRangeException(nameof(compilerType), $"Cannot get compiler path for \"{compilerType}\" compiler type.");
        }
    }

    public ICompiler CreateCompiler(CompilerType compilerType, ExecutionStrategyType strategyType)
        => compilerType switch
        {
            CompilerType.None => throw new ArgumentException($"Cannot create compiler from {compilerType} compiler type."),
            CompilerType.CSharpDotNetCore => new CSharpDotNetCoreCompiler(
                this.settings.CSharpDotNetCoreCompilerProcessExitTimeOutMultiplier,
                this.GetCSharpDotNetCoreCompilerPath(strategyType),
                this.GetDotNetCoreSharedAssembliesPath(strategyType)),
            CompilerType.CPlusPlusGcc => new CPlusPlusCompiler(this.settings
                .CPlusPlusCompilerProcessExitTimeOutMultiplier),
            CompilerType.Java => new JavaCompiler(this.settings.JavaCompilerProcessExitTimeOutMultiplier),
            CompilerType.JavaZip => new JavaZipCompiler(this.settings.JavaZipCompilerProcessExitTimeOutMultiplier),
            CompilerType.JavaInPlaceCompiler => new JavaInPlaceFolderCompiler(this.settings
                .JavaInPlaceCompilerProcessExitTimeOutMultiplier),
            CompilerType.CPlusPlusZip => new CPlusPlusZipCompiler(this.settings
                .CPlusPlusZipCompilerProcessExitTimeOutMultiplier),
            CompilerType.DotNetCompiler => new DotNetCompiler(this.settings.DotNetCompilerProcessExitTimeOutMultiplier),
            CompilerType.GolangCompiler => new GolangCompiler(this.settings.GolangCompilerProcessExitTimeOutMultiplier),
            _ => throw new ArgumentException("Unsupported compiler."),
        };

    private string GetCSharpDotNetCoreCompilerPath(ExecutionStrategyType type)
        => type switch
        {
            ExecutionStrategyType.DotNetCoreCompileExecuteAndCheck => this.settings.CSharpDotNet3CoreCompilerPath,
            ExecutionStrategyType.DotNetCore5CompileExecuteAndCheck => this.settings.CSharpDotNetCore5CompilerPath,
            _ => this.settings.CSharpDotNetCore6CompilerPath,
        };

    private string GetDotNetCoreSharedAssembliesPath(ExecutionStrategyType type)
        => type switch
        {
            ExecutionStrategyType.DotNetCoreCompileExecuteAndCheck => this.settings.DotNetCore3SharedAssembliesPath,
            ExecutionStrategyType.DotNetCore5CompileExecuteAndCheck => this.settings.DotNetCore5SharedAssembliesPath,
            _ => this.settings.DotNetCore6SharedAssembliesPath,
        };
}
