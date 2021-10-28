namespace OJS.Services.Data.Infrastructure.Implementations
{
    using OJS.Common.Contracts;
    using OJS.Common.Enumerations;
    using System.Collections.Generic;
    using System.Linq;

    public class GlobalQueryFilterTypesCache : IGlobalQueryFilterTypesCache
    {
        private readonly IEnumerable<GlobalQueryFilterType> globalQueryFilterTypes;

        public GlobalQueryFilterTypesCache(IEnumerable<GlobalQueryFilterType> globalQueryFilterTypes)
            => this.globalQueryFilterTypes = globalQueryFilterTypes ?? Enumerable.Empty<GlobalQueryFilterType>();

        public IEnumerable<GlobalQueryFilterType> GetAll() => this.globalQueryFilterTypes;
    }
}