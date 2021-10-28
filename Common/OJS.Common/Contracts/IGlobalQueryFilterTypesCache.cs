namespace OJS.Common.Contracts
{
    using OJS.Common.Enumerations;
    using System.Collections.Generic;

    public interface IGlobalQueryFilterTypesCache
    {
        IEnumerable<GlobalQueryFilterType> GetAll();
    }
}