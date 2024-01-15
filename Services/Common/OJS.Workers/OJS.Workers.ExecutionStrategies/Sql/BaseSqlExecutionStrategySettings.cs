namespace OJS.Workers.ExecutionStrategies.Sql;

using OJS.Workers.Common.Models;

public class BaseSqlExecutionStrategySettings : IExecutionStrategySettings
{
    public string MasterDbConnectionString { get; set; } = string.Empty;
    public string RestrictedUserId { get; set; } = string.Empty;
    public string RestrictedUserPassword { get; set; } = string.Empty;
}