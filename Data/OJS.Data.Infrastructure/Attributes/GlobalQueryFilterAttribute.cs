namespace OJS.Data.Infrastructure.Attributes
{
    using OJS.Data.Infrastructure.Enumerations;

    public class GlobalQueryFilterAttribute : FluentApiConfigurationAttribute
    {
        public GlobalQueryFilterAttribute(GlobalQueryFilterType filterType)
            => this.FilterType = filterType;

        public GlobalQueryFilterType FilterType { get; }
    }
}