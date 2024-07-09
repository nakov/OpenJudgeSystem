namespace OJS.Services.Worker.Business.Implementations;

using Microsoft.Build.Framework;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using OJS.Services.Worker.Models.Configuration;
using OJS.Workers.Common;
using OJS.Workers.Common.Models;
using OJS.Workers.Compilers;
using System;

public class CompilerFactory : ICompilerFactory
{
    private readonly OjsWorkersConfig settings;
    private readonly ILogger<Compiler> logger;

    public CompilerFactory(
        IOptions<OjsWorkersConfig> settingsAccessor,
        ILogger<Compiler> logger)
    {
        this.settings = settingsAccessor.Value;
        this.logger = logger;
    }

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
                return this.GetJavaCompilerPath(strategyType);
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
                this.GetDotNetCoreSharedAssembliesPath(strategyType),
                this.logger),
            CompilerType.CPlusPlusGcc => new CPlusPlusCompiler(
                this.settings.CPlusPlusCompilerProcessExitTimeOutMultiplier,
                this.logger),
            CompilerType.Java => new JavaCompiler(
                this.settings.JavaCompilerProcessExitTimeOutMultiplier,
                this.logger),
            CompilerType.JavaZip => new JavaZipCompiler(
                this.settings.JavaZipCompilerProcessExitTimeOutMultiplier,
                this.logger),
            CompilerType.JavaInPlaceCompiler => new JavaInPlaceFolderCompiler(
                this.settings.JavaInPlaceCompilerProcessExitTimeOutMultiplier,
                this.logger),
            CompilerType.CPlusPlusZip => new CPlusPlusZipCompiler(
                this.settings.CPlusPlusZipCompilerProcessExitTimeOutMultiplier,
                this.logger),
            CompilerType.DotNetCompiler => new DotNetCompiler(
                this.settings.DotNetCompilerProcessExitTimeOutMultiplier,
                this.logger),
            CompilerType.GolangCompiler => new GolangCompiler(
                this.settings.GolangCompilerProcessExitTimeOutMultiplier,
                this.logger),
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

    private string GetJavaCompilerPath(ExecutionStrategyType strategyType)
        => strategyType.ToString().Contains("21")
            ? this.settings.Java21CompilerPath
            : this.settings.JavaCompilerPath;
}
