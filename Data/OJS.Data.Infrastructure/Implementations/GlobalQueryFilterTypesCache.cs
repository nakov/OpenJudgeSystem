namespace OJS.Data.Infrastructure.Implementations
{
    using System.Collections.Generic;
    using System.Linq;
    using OJS.Data.Infrastructure.Enumerations;

    internal class GlobalQueryFilterTypesCache : IGlobalQueryFilterTypesCache
    {
        private readonly IEnumerable<GlobalQueryFilterType> globalQueryFilterTypes;

        public GlobalQueryFilterTypesCache(IEnumerable<GlobalQueryFilterType> globalQueryFilterTypes)
            => this.globalQueryFilterTypes = globalQueryFilterTypes;

        public IEnumerable<GlobalQueryFilterType> GetAll() => this.globalQueryFilterTypes;

        public bool Contains(GlobalQueryFilterType globalQueryFilterType)
            => this.GetAll().Any(ft => ft == globalQueryFilterType);
    }
}