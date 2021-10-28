namespace OJS.Data.Infrastructure.Attributes
{
    using OJS.Common.Enumerations;

    public class GlobalQueryFilterAttribute : FluentApiConfigurationAttribute
    {
        public GlobalQueryFilterAttribute(GlobalQueryFilterType filterType)
            => this.FilterType = filterType;

        public GlobalQueryFilterType FilterType { get; }
    }
}