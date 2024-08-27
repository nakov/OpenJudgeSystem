namespace OJS.Services.Infrastructure.Constants;

using System.Text;

public static class ResilienceStrategyConstants
{
    public static class Common
    {
        public const string OperationKey = "OperationKey";
    }

    public static class RedisCircuitBreakerOperations
    {
        public static CompositeFormat GetItem => CompositeFormat.Parse("Get_{0}");
        public static CompositeFormat RemoveItem => CompositeFormat.Parse("Remove_{0}");
    }
}