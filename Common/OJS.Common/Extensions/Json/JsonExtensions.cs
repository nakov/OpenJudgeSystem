namespace OJS.Common.Extensions.Json
{
    using Newtonsoft.Json;
    using Newtonsoft.Json.Serialization;
    using System.Linq;
    using System.Web;

    public static class JsonExtensions
    {
        private static JsonSerializer JsonSerializer
            => JsonSerializer.Create(JsonSerializerSettings);

        private static JsonSerializerSettings JsonSerializerSettings
            => new JsonSerializerSettings
            {
                NullValueHandling = NullValueHandling.Ignore,
                ContractResolver = new DefaultContractResolver
                {
                    NamingStrategy = new CamelCaseNamingStrategy(),
                },
            };

        private static JsonSerializerSettings JsonWithSnakeCaseSerializerSettings
            => new JsonSerializerSettings
            {
                ContractResolver = new DefaultContractResolver
                {
                    NamingStrategy = new SnakeCaseNamingStrategy(),
                },
            };

        public static object FromJson(this string json)
            => JsonConvert.DeserializeObject(json, JsonSerializerSettings);

        public static T FromJson<T>(this string json)
            => JsonConvert.DeserializeObject<T>(json, JsonSerializerSettings);

        public static T FromJsonInSnakeCase<T>(this string json)
            => JsonConvert.DeserializeObject<T>(json, JsonWithSnakeCaseSerializerSettings);

        public static string ToJson(this object obj)
            => JsonConvert.SerializeObject(obj, JsonSerializerSettings);

        public static string ToJsonFromQuery(this string query)
        {
            var parsedQuery = HttpUtility.ParseQueryString(query);

            return JsonConvert.SerializeObject(
                parsedQuery
                    .Cast<string>()
                    .ToDictionary(k => k, v => parsedQuery[v]),
                JsonSerializerSettings);
        }
    }
}