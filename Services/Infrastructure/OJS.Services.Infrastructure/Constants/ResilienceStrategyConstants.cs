namespace OJS.Services.Infrastructure.Constants;

public static class ResilienceStrategyConstants
{
    public static class Common
    {
        public const string OperationKey = "OperationKey";
    }

    public static class RedisCircuitBreakerOperations
    {
        public const string GetItem = "Get_{0}";
        public const string RemoveItem = "Remove_{0}";
    }
}