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

    public string GetCompilerPath(CompilerType type)
    {
        switch (type)
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
                throw new ArgumentOutOfRangeException(nameof(type), $"Cannot get compiler path for \"{type}\" compiler type.");
        }
    }

    public ICompiler CreateCompiler(
        CompilerType compilerType,
        ExecutionStrategyType type = ExecutionStrategyType.DoNothing)
        => compilerType switch
        {
            CompilerType.None => throw new ArgumentException($"Cannot create compiler from {type} compiler type."),
            CompilerType.CSharpDotNetCore => new CSharpDotNetCoreCompiler(
                this.settings.CSharpDotNetCoreCompilerProcessExitTimeOutMultiplier,
                this.settings.CSharpDotNetCoreCompilerPath(type),
                this.settings.DotNetCoreSharedAssembliesPath(type)),
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
}
