namespace OJS.Services.Worker.Models.Configuration;

using OJS.Services.Common.Models.Configurations;
using OJS.Workers.Common.Models;
using System.ComponentModel.DataAnnotations;

public class OjsWorkersConfig : BaseConfig
{
    public override string SectionName => "OjsWorkersConfig";

    [Required]
    public string CSharpDotNet3CoreCompilerPath { get; set; } = string.Empty;

    [Required]
    public string CSharpDotNetCore5CompilerPath { get; set; } = string.Empty;

    [Required]
    public string CSharpDotNetCore6CompilerPath { get; set; } = string.Empty;

    [Required]
    public string DotNetCompilerPath { get; set; } = string.Empty;

    [Required]
    public string DotNetCore3RuntimeVersion { get; set; } = string.Empty;

    [Required]
    public string DotNetCore5RuntimeVersion { get; set; } = string.Empty;

    [Required]
    public string DotNetCore6RuntimeVersion { get; set; } = string.Empty;

    [Required]
    public string DotNetCore3SharedAssembliesPath { get; set; } = string.Empty;

    [Required]
    public string DotNetCore5SharedAssembliesPath { get; set; } = string.Empty;

    [Required]
    public string DotNetCore6SharedAssembliesPath { get; set; } = string.Empty;

    [Required]
    public string MavenPath { get; set; } = string.Empty;

    [Required]
    public string CPlusPlusGccCompilerPath { get; set; } = string.Empty;

    public string? NUnitConsoleRunnerPath { get; set; }

    [Required]
    public string GolangCompilerPath { get; set; } = string.Empty;

    [Required]
    public string JavaCompilerPath { get; set; } = string.Empty;

    [Required]
    public string JavaExecutablePath { get; set; } = string.Empty;

    [Required]
    public string JavaLibsPath { get; set; } = string.Empty;

    [Required]
    public string Java17CompilerPath { get; set; } = string.Empty;

    [Required]
    public string Java17LibsPath { get; set; } = string.Empty;

    [Required]
    public string Java17ExecutablePath { get; set; } = string.Empty;

    [Required]
    public string NodeJsExecutablePath { get; set; } = string.Empty;

    [Required]
    public string JsProjNodeModules { get; set; } = string.Empty;

    [Required]
    public string MochaModulePath { get; set; } = string.Empty;

    [Required]
    public string ChaiModulePath { get; set; } = string.Empty;

    [Required]
    public string PlaywrightChromiumModulePath { get; set; } = string.Empty;

    [Required]
    public string JsDomModulePath { get; set; } = string.Empty;

    [Required]
    public string JQueryModulePath { get; set; } = string.Empty;

    [Required]
    public string HandlebarsModulePath { get; set; } = string.Empty;

    [Required]
    public string SinonModulePath { get; set; } = string.Empty;

    public string? SinonJsDomModulePath { get; set; }

    [Required]
    public string SinonChaiModulePath { get; set; } = string.Empty;

    [Required]
    public string UnderscoreModulePath { get; set; } = string.Empty;

    public string? BrowserifyModulePath { get; set; }

    public string? BabelifyModulePath { get; set; }

    public string? Es2015ImportPluginPath { get; set; }

    public string? BabelCoreModulePath { get; set; }

    public string? ReactJsxPluginPath { get; set; }

    public string? ReactModulePath { get; set; }

    public string? ReactDomModulePath { get; set; }

    public string? NodeFetchModulePath { get; set; }

    [Required]
    public string BootstrapModulePath { get; set; } = string.Empty;

    [Required]
    public string BootstrapCssPath { get; set; } = string.Empty;

    [Required]
    public string PythonExecutablePath { get; set; } = string.Empty;

    [Required]
    public string SqlServerLocalDbMasterDbConnectionString { get; set; } = string.Empty;

    [Required]
    public string SqlServerLocalDbRestrictedUserId { get; set; } = string.Empty;

    [Required]
    public string SqlServerLocalDbRestrictedUserPassword { get; set; } = string.Empty;

    [Required]
    public string MySqlSysDbConnectionString { get; set; } = string.Empty;

    [Required]
    public string MySqlRestrictedUserId { get; set; } = string.Empty;

    [Required]
    public string MySqlRestrictedUserPassword { get; set; } = string.Empty;

    [Required]
    public string PythonExecutablePathV311 { get; set; } = string.Empty;

    [Required]
    public string PipExecutablePathV311 { get; set; } = string.Empty;

    [Required]
    public string PostgreSqlMasterDbConnectionString { get; set; } = string.Empty;

    [Required]
    public string PostgreSqlRestrictedUserId { get; set; } = string.Empty;

    [Required]
    public string PostgreSqlRestrictedUserPassword { get; set; } = string.Empty;

    public int JsProjDefaultApplicationPortNumber { get; set; } = 9636;

    public int NodeJsBaseTimeUsedInMilliseconds { get; set; }

    public int NodeJsBaseMemoryUsedInBytes { get; set; }

    public int MsBuildBaseTimeUsedInMilliseconds { get; set; }

    public int MsBuildBaseMemoryUsedInBytes { get; set; }

    public int DotNetCscBaseTimeUsedInMilliseconds { get; set; }

    public int DotNetCscBaseMemoryUsedInBytes { get; set; }

    public int DotNetCliBaseTimeUsedInMilliseconds { get; set; }

    public int DotNetCliBaseMemoryUsedInBytes { get; set; }

    public int GolangBaseTimeUsedInMilliseconds { get; set; }

    public int GolangBaseMemoryUsedInBytes { get; set; }

    public int JavaBaseTimeUsedInMilliseconds { get; set; }

    public int JavaBaseMemoryUsedInBytes { get; set; }

    public int JavaBaseUpdateTimeOffsetInMilliseconds { get; set; }

    public int GPlusPlusBaseTimeUsedInMilliseconds { get; set; }

    public int GPlusPlusBaseMemoryUsedInBytes { get; set; }

    public int PythonBaseTimeUsedInMilliseconds { get; set; }

    public int PythonBaseMemoryUsedInBytes { get; set; }

    public int PythonV311BaseTimeUsedInMilliseconds { get; set; }

    public int PythonV311InstallPackagesTimeUsedInMilliseconds { get; set; }

    public int PythonV311BaseMemoryUsedInBytes { get; set; }

    // Compiler time out multipliers
    public int CPlusPlusCompilerProcessExitTimeOutMultiplier { get; set; } = 1;

    public int CPlusPlusZipCompilerProcessExitTimeOutMultiplier { get; set; } = 1;

    public int CSharpDotNetCoreCompilerProcessExitTimeOutMultiplier { get; set; } = 1;

    public int DotNetCompilerProcessExitTimeOutMultiplier { get; set; } = 1;

    public int GolangCompilerProcessExitTimeOutMultiplier { get; set; } = 1;

    public int JavaCompilerProcessExitTimeOutMultiplier { get; set; } = 1;

    public int JavaInPlaceCompilerProcessExitTimeOutMultiplier { get; set; } = 1;

    public int JavaZipCompilerProcessExitTimeOutMultiplier { get; set; } = 1;

    public static string DotNetCoreTargetFrameworkName(ExecutionStrategyType type)
        => type switch
        {
            ExecutionStrategyType.DotNetCoreProjectTestsExecutionStrategy => "netcoreapp3.1",
            ExecutionStrategyType.DotNetCore5ProjectTestsExecutionStrategy => "net5.0",
            _ => "net6.0",
        };

    public static string MicrosoftEntityFrameworkCoreInMemoryVersion(ExecutionStrategyType type)
        => type switch
        {
            ExecutionStrategyType.DotNetCoreProjectTestsExecutionStrategy => "3.1.4",
            ExecutionStrategyType.DotNetCore5ProjectTestsExecutionStrategy => "5.0.13",
            _ => "6.0.1",
        };

    public static string MicrosoftEntityFrameworkCoreProxiesVersion(ExecutionStrategyType type)
        => type switch
        {
            ExecutionStrategyType.DotNetCoreProjectTestsExecutionStrategy => "3.1.4",
            ExecutionStrategyType.DotNetCore5ProjectTestsExecutionStrategy => "5.0.13",
            _ => "6.0.1",
        };

    public string CSharpDotNetCoreCompilerPath(ExecutionStrategyType type)
        => type switch
        {
            ExecutionStrategyType.DotNetCoreCompileExecuteAndCheck => this.CSharpDotNet3CoreCompilerPath,
            ExecutionStrategyType.DotNetCore5CompileExecuteAndCheck => this.CSharpDotNetCore5CompilerPath,
            _ => this.CSharpDotNetCore6CompilerPath,
        };

    public string DotNetCoreRuntimeVersion(ExecutionStrategyType type)
        => type switch
        {
            ExecutionStrategyType.DotNetCoreCompileExecuteAndCheck => this.DotNetCore3RuntimeVersion,
            ExecutionStrategyType.DotNetCore5CompileExecuteAndCheck => this.DotNetCore5RuntimeVersion,
            _ => this.DotNetCore6RuntimeVersion,
        };

    public string DotNetCoreSharedAssembliesPath(ExecutionStrategyType type)
        => type switch
        {
            ExecutionStrategyType.DotNetCoreCompileExecuteAndCheck => this.DotNetCore3SharedAssembliesPath,
            ExecutionStrategyType.DotNetCore5CompileExecuteAndCheck => this.DotNetCore5SharedAssembliesPath,
            _ => this.DotNetCore6SharedAssembliesPath,
        };
}