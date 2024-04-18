namespace OJS.Data.Infrastructure.Configurators
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;
    using OJS.Data.Infrastructure.Attributes;
    using OJS.Data.Infrastructure.Enumerations;

    internal class GlobalQueryFilterConfigurator : FluentApiConfigurator
    {
        private readonly GlobalQueryFilterAttribute configurationAttribute;
        private readonly IEnumerable<GlobalQueryFilterType> availableGlobalQueryFilterTypes;

        public GlobalQueryFilterConfigurator(
            MethodInfo configurationMethodInfo,
            Type configurationType,
            GlobalQueryFilterAttribute configurationAttribute,
            IEnumerable<GlobalQueryFilterType> availableGlobalQueryFilterTypes)
            : base(configurationMethodInfo, configurationType)
        {
            this.configurationAttribute = configurationAttribute;
            this.availableGlobalQueryFilterTypes = availableGlobalQueryFilterTypes;
        }

        protected override bool ConfigurationIsApplicable(Type entityType)
            => this.GlobalQueryFilterIsApplicable() &&
               EntityTypeSupportsGlobalQueryFilters(entityType);

        private static bool EntityTypeSupportsGlobalQueryFilters(Type entityType)
            => entityType.BaseType?.IsGenericType ?? true;

        private bool GlobalQueryFilterIsApplicable()
            => this.availableGlobalQueryFilterTypes
                   ?.Contains(this.configurationAttribute.FilterType)
               ?? false;
    }
}